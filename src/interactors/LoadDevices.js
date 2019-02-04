class LoadDevices {
  constructor(deviceStore, cloudConnector, fogConnector) {
    this.deviceStore = deviceStore;
    this.cloudConnector = cloudConnector;
    this.fogConnector = fogConnector;
  }

  async execute() {
    const devices = await this.cloudConnector.listDevices();
    devices.map(async (device) => {
      this.deviceStore.add(device);
      await this.fogConnector.subscribe(device.id, 'broadcast');
    });
  }
}

export default LoadDevices;
