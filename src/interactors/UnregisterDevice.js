import logger from 'util/logger';

class UnregisterDevice {
  constructor(cloudConnector, publisher) {
    this.cloudConnector = cloudConnector;
    this.publisher = publisher;
  }

  async execute(device) {
    logger.debug(`Device ${device.id} removed`);
    try {
      await this.cloudConnector.removeDevice(device.id);
    } catch (err) {
      logger.error(err.stack);
      await this.publisher.sendUnregisteredDevice({ id: device.id, error: err.message });
    }
  }
}

export default UnregisterDevice;
