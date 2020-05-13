import logger from 'util/logger';

class UnregisterDevice {
  constructor(cloudConnector, publisher) {
    this.cloudConnector = cloudConnector;
    this.publisher = publisher;
  }

  async execute(device) {
    try {
      await this.cloudConnector.removeDevice(device.id);
      logger.debug(`Device ${device.id} removed`);
    } catch (err) {
      logger.error(err.message);
    }
  }
}

export default UnregisterDevice;
