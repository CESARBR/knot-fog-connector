class DevicesService {
  constructor(
    loadDevicesInteractor,
    registerDeviceInteractor,
    unregisterDeviceInteractor,
    listDevicesInteractor,
    updateSchemaInteractor,
  ) {
    this.loadDevicesInteractor = loadDevicesInteractor;
    this.registerDeviceInteractor = registerDeviceInteractor;
    this.unregisterDeviceInteractor = unregisterDeviceInteractor;
    this.listDevicesInteractor = listDevicesInteractor;
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

  async load() {
    await this.loadDevicesInteractor.execute();
  }

  async list() {
    return this.listDevicesInteractor.execute();
  }
}

export default DevicesService;
