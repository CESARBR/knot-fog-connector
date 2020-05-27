class DevicesService {
  constructor(
    registerDeviceInteractor,
    unregisterDeviceInteractor,
    updateSchemaInteractor
  ) {
    this.registerDeviceInteractor = registerDeviceInteractor;
    this.unregisterDeviceInteractor = unregisterDeviceInteractor;
    this.updateSchemaInteractor = updateSchemaInteractor;
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
}

export default DevicesService;
