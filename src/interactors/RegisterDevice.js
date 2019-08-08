import logger from 'util/logger';

class RegisterDevice {
  constructor(deviceStore, cloudConnector) {
    this.deviceStore = deviceStore;
    this.cloudConnector = cloudConnector;
  }

  async execute({ id, name }) {
    logger.debug(`Device ${id} added`);
    const deviceToBeSaved = {
      id,
      name,
    };

    await this.deviceStore.add(deviceToBeSaved);
    await this.cloudConnector.addDevice(deviceToBeSaved);
  }
}

export default RegisterDevice;
