import logger from 'util/logger';

class RegisterDevice {
  constructor(cloudConnector, publisher) {
    this.cloudConnector = cloudConnector;
    this.publisher = publisher;
  }

  async execute(device) {
    try {
      await this.cloudConnector.addDevice(device);
      logger.debug(`Device ${device.id} added`);
    } catch (err) {
      logger.error(err.message);
    }
  }
}

export default RegisterDevice;
