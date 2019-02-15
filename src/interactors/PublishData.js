import convertToCamelCase from 'util/camelCase';

class PublishData {
  constructor(deviceStore, cloudConnector) {
    this.deviceStore = deviceStore;
    this.cloudConnector = cloudConnector;
  }

  async convertData(id, data) {
    const devices = await this.deviceStore.list();
    const device = devices.find(dev => dev.id === id);
    const dataToSend = convertToCamelCase(data);
    dataToSend.sensorId = Number(dataToSend.sensorId);

    const schema = device.schema.find(value => value.sensorId === dataToSend.sensorId);

    switch (schema.valueType) {
      case 1:
      case 2:
        dataToSend.value = Number(dataToSend.value);
        break;
      case 3:
        if (dataToSend.value === 'true') {
          dataToSend.value = true;
        } else if (dataToSend.value === 'false') {
          dataToSend.value = false;
        }
        break;
      default:
        break;
    }
    return dataToSend;
  }

  async execute(id, data) {
    await this.cloudConnector.publishData(id, [await this.convertData(id, data)]);
  }
}

export default PublishData;
