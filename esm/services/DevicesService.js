class DevicesService {
  constructor(updateDevicesInteractor, loadDevicesInteractor) {
    this.updateDevicesInteractor = updateDevicesInteractor;
    this.loadDevicesInteractor = loadDevicesInteractor;
  }

  async update() {
    await this.updateDevicesInteractor.execute();
  }

  async load() {
    await this.loadDevicesInteractor.execute();
  }
}

export default DevicesService;
