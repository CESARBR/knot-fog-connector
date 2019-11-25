import logger from 'util/logger';

class RegisterDevice {
  constructor(deviceStore, cloudConnector, queue) {
    this.deviceStore = deviceStore;
    this.cloudConnector = cloudConnector;
    this.queue = queue;
  }

  async execute({ id, name }) {
    logger.debug(`Device ${id} added`);
    const deviceToBeSaved = {
      id,
      name,
    };

    const registeredDevice = await this.cloudConnector.addDevice(deviceToBeSaved);
    await this.deviceStore.add(deviceToBeSaved);
    await this.queue.sendRegisteredDevice(registeredDevice);
  }
}

export default RegisterDevice;
