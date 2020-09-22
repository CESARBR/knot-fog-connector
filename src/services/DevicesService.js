class DevicesService {
  constructor(
    registerDeviceInteractor,
    unregisterDeviceInteractor,
    updateConfigInteractor
  ) {
    this.registerDeviceInteractor = registerDeviceInteractor;
    this.unregisterDeviceInteractor = unregisterDeviceInteractor;
    this.updateConfigInteractor = updateConfigInteractor;
  }

  async register(device) {
    await this.registerDeviceInteractor.execute(device);
  }

  async unregister(device) {
    await this.unregisterDeviceInteractor.execute(device);
  }

  async updateConfig(device) {
    await this.updateConfigInteractor.execute(device);
  }
}

export default DevicesService;
