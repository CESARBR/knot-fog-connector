import _ from 'lodash';

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
  }

  async updateDevicesAdded(cloudDevices, fogDevices) {
    _.differenceBy(fogDevices, cloudDevices, 'id').map(async (device) => {
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
      await this.deviceStore.remove(device);
      await this.cloudConnector.removeDevice(device.id);
    });
  }
}

export default UpdateDevices;
