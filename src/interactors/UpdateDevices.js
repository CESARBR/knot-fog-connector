import _ from 'lodash';

import difference from 'util/difference';
import logger from 'util/logger';
import convertToCamelCase from 'util/camelCase';

function comparator(elem1, elem2) {
  if (elem1.id !== elem2.id) {
    return false;
  }

  const diff = difference(elem1, elem2);
  return !(diff.schema && diff.schema.length > 0);
}

class UpdateDevices {
  constructor(deviceStore, fogConnector, cloudConnector) {
    this.deviceStore = deviceStore;
    this.fogConnector = fogConnector;
    this.cloudConnector = cloudConnector;
  }

  async execute() {
    const cloudDevices = await this.deviceStore.list();
    const fogDevices = await this.fogConnector.getMyDevices();
    _.mapValues(fogDevices, (value) => {
      const device = value;
      device.schema = convertToCamelCase(device.schema);
      return device;
    });

    await this.updateDevicesAdded(cloudDevices, fogDevices);
    await this.updateDevicesRemoved(cloudDevices, fogDevices);
    await this.updateDevicesSchema(cloudDevices, fogDevices);
  }

  async updateDevicesAdded(cloudDevices, fogDevices) {
    const devices = _.differenceBy(fogDevices, cloudDevices, 'id');
    return Promise.all(devices.map(async (device) => {
      logger.debug(`Device ${device.id} added`);
      const deviceToBeSaved = {
        id: device.id,
        name: device.name,
      };

      await this.deviceStore.add(deviceToBeSaved);
      await this.cloudConnector.addDevice(deviceToBeSaved);
      await this.fogConnector.subscribe(device.id, 'broadcast');
    }));
  }

  async updateDevicesRemoved(cloudDevices, fogDevices) {
    const devices = _.differenceBy(cloudDevices, fogDevices, 'id');
    return Promise.all(devices.map(async (device) => {
      logger.debug(`Device ${device.id} removed`);
      await this.deviceStore.remove(device);
      await this.cloudConnector.removeDevice(device.id);
    }));
  }

  async updateDevicesSchema(cloudDevices, fogDevices) {
    const devices = _.differenceWith(fogDevices, cloudDevices, comparator);
    return Promise.all(devices.map(async (device) => {
      logger.debug(`Device ${device.id} schema updated`);
      await this.deviceStore.update(device.id, { schema: convertToCamelCase(device.schema) });
      await this.cloudConnector.updateSchema(device.id, convertToCamelCase(device.schema));
    }));
  }
}

export default UpdateDevices;
