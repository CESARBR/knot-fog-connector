import logger from 'util/logger';

class UnregisterDevice {
  constructor(cloudConnector) {
    this.cloudConnector = cloudConnector;
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
