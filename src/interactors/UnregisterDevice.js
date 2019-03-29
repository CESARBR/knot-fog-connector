import logger from 'util/logger';

class UnregisterDevice {
  constructor(deviceStore, cloudConnector) {
    this.deviceStore = deviceStore;
    this.cloudConnector = cloudConnector;
  }

  async execute(device) {
    logger.debug(`Device ${device.id} removed`);
    await this.deviceStore.remove(device);
    await this.cloudConnector.removeDevice(device.id);
  }
}

export default UnregisterDevice;
