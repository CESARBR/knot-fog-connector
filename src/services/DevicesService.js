class DevicesService {
  constructor(updateDevicesInteractor, updateChangesInteractor) {
    this.updateDevicesInteractor = updateDevicesInteractor;
    this.updateChangesInteractor = updateChangesInteractor;
  }

  async update() {
    await this.updateDevicesInteractor.execute();
  }

  async updateChanges(device) {
    await this.updateChangesInteractor.execute(device);
  }
}

export default DevicesService;
