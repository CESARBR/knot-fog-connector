class LoadDevices {
  constructor(deviceStore, cloudConnector) {
    this.deviceStore = deviceStore;
    this.cloudConnector = cloudConnector;
  }

  async execute() {
    const devices = await this.cloudConnector.listDevices();
    devices.map(async device => this.deviceStore.add(device));
  }
}

export default LoadDevices;
