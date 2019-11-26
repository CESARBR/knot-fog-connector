import logger from 'util/logger';

class UnregisterDevice {
  constructor(deviceStore, cloudConnector, publisher) {
    this.deviceStore = deviceStore;
    this.cloudConnector = cloudConnector;
    this.publisher = publisher;
  }

  async execute(device) {
    logger.debug(`Device ${device.id} removed`);
    try {
      await this.cloudConnector.removeDevice(device.id);
      await this.deviceStore.remove(device);
    } catch (err) {
      logger.error(err.stack);
      await this.publisher.sendUnregisteredDevice({ id: device.id, error: err.message });
    }
  }
}

export default UnregisterDevice;
