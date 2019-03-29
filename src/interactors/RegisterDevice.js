import logger from 'util/logger';

class RegisterDevice {
  constructor(deviceStore, fogConnector, cloudConnector) {
    this.deviceStore = deviceStore;
    this.fogConnector = fogConnector;
    this.cloudConnector = cloudConnector;
  }

  async execute(device) {
    logger.debug(`Device ${device.id} added`);
    const deviceToBeSaved = {
      id: device.id,
      name: device.name,
    };

    await this.deviceStore.add(deviceToBeSaved);
    await this.cloudConnector.addDevice(deviceToBeSaved);
    await this.fogConnector.subscribe(device.id, 'broadcast');
  }
}

export default RegisterDevice;
