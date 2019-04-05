import logger from 'util/logger';

class RegisterDevice {
  constructor(deviceStore, fogConnector, cloudConnector) {
    this.deviceStore = deviceStore;
    this.fogConnector = fogConnector;
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
    await this.fogConnector.subscribe(id, 'broadcast');
  }
}

export default RegisterDevice;
