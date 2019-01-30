import _ from 'lodash';

import logger from 'util/logger';

class UpdateDevices {
  constructor(deviceStore, fogConnector, cloudConnector) {
    this.deviceStore = deviceStore;
    this.fogConnector = fogConnector;
    this.cloudConnector = cloudConnector;
  }

  async execute() {
    const cloudDevices = await this.deviceStore.list();
    const fogDevices = await this.fogConnector.getMyDevices();

    await this.updateDevicesAdded(cloudDevices, fogDevices);
    await this.updateDevicesRemoved(cloudDevices, fogDevices);
    await this.updateDevicesSchema(cloudDevices, fogDevices);
  }

  async updateDevicesAdded(cloudDevices, fogDevices) {
    _.differenceBy(fogDevices, cloudDevices, 'id').map(async (device) => {
      logger.debug(`Device ${device.id} added`);
      await this.deviceStore.add(device);
      await this.cloudConnector.addDevice({
        id: device.id,
        name: device.name,
      });
      await this.fogConnector.subscribe(device.id, 'broadcast');
    });
  }

  async updateDevicesRemoved(cloudDevices, fogDevices) {
    _.differenceBy(cloudDevices, fogDevices, 'id').map(async (device) => {
      logger.debug(`Device ${device.id} removed`);
      await this.deviceStore.remove(device);
      await this.cloudConnector.removeDevice(device.id);
    });
  }

  async updateDevicesSchema(cloudDevices, fogDevices) {
    _.differenceWith(fogDevices, cloudDevices, _.isEqual).map(async (device) => {
      logger.debug(`Device ${device.id} schema updated`);
      await this.cloudConnector.updateSchema(device.id, device.schema);
      await this.deviceStore.update(device.id, { schema: device.schema });
    });
  }
}

export default UpdateDevices;
