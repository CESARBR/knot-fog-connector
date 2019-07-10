import _ from 'lodash';
import difference from 'util/difference';
import convertToCamelCase from 'util/camelCase';

function comparator(elem1, elem2) {
  if (elem1.id !== elem2.id) {
    return false;
  }

  const diff = difference(elem1, elem2);
  return !(diff.schema && diff.schema.length > 0);
}

function convertSchemaToCamelCase(value) {
  const device = value;
  device.schema = convertToCamelCase(device.schema);
  return device;
}

class DevicesPolling {
  constructor(fogConnector, cloudConnector, queue) {
    this.fogConnector = fogConnector;
    this.cloudConnector = cloudConnector;
    this.queue = queue;
  }

  async start() {
    setInterval(this.syncDevices.bind(this), 5000);
  }

  async syncDevices() {
    const cloudDevices = await this.cloudConnector.listDevices();
    const fogDevices = await this.fogConnector.getMyDevices();
    _.mapValues(fogDevices, value => convertSchemaToCamelCase(value));

    await this.updateDevicesAdded(cloudDevices, fogDevices);
    await this.updateDevicesRemoved(cloudDevices, fogDevices);
    await this.updateDevicesSchema(cloudDevices, fogDevices);
  }

  async updateDevicesAdded(cloudDevices, fogDevices) {
    const devices = _.differenceBy(fogDevices, cloudDevices, 'id');
    return Promise.all(devices.map(async (device) => {
      await this.queue.send('cloud', 'device.register', device);
    }));
  }

  async updateDevicesRemoved(cloudDevices, fogDevices) {
    const devices = _.differenceBy(cloudDevices, fogDevices, 'id');
    return Promise.all(devices.map(async (device) => {
      await this.queue.send('cloud', 'device.unregister', device);
    }));
  }

  async updateDevicesSchema(cloudDevices, fogDevices) {
    const devices = _.differenceWith(fogDevices, cloudDevices, comparator);
    return Promise.all(devices.map(async (device) => {
      if (_.isArray(device.schema)) {
        await this.queue.send('cloud', 'schema.update', device);
      }
    }));
  }
}

export default DevicesPolling;
