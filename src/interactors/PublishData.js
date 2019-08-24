import convertToCamelCase from 'util/camelCase';

class PublishData {
  constructor(deviceStore, cloudConnector) {
    this.deviceStore = deviceStore;
    this.cloudConnector = cloudConnector;
  }

  async execute(id, data) {
    const devices = await this.deviceStore.list();
    const device = devices.find(dev => dev.id === id);
    if (!device.schema) {
      return;
    }

    await this.cloudConnector.publishData(id, data.map(d => convertToCamelCase(d)));
  }
}

export default PublishData;
