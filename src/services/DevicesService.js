class DevicesService {
  constructor(
    registerDeviceInteractor,
    unregisterDeviceInteractor,
    updateSchemaInteractor,
    updateConfigInteractor
  ) {
    this.registerDeviceInteractor = registerDeviceInteractor;
    this.unregisterDeviceInteractor = unregisterDeviceInteractor;
    this.updateSchemaInteractor = updateSchemaInteractor;
    this.updateConfigInteractor = updateConfigInteractor;
  }

  async register(device) {
    await this.registerDeviceInteractor.execute(device);
  }

  async unregister(device) {
    await this.unregisterDeviceInteractor.execute(device);
  }

  async updateSchema(device) {
    await this.updateSchemaInteractor.execute(device);
  }

  async updateConfig(device) {
    await this.updateConfigInteractor.execute(device);
  }
}

export default DevicesService;
