class DevicesService {
  constructor(
    loadDevicesInteractor,
    updateChangesInteractor,
    registerDeviceInteractor,
    unregisterDeviceInteractor,
    updateSchemaInteractor,
  ) {
    this.loadDevicesInteractor = loadDevicesInteractor;
    this.updateChangesInteractor = updateChangesInteractor;
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

  async load() {
    await this.loadDevicesInteractor.execute();
  }

  async updateChanges(device) {
    await this.updateChangesInteractor.execute(device);
  }
}

export default DevicesService;
