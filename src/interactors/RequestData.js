import convertToSnakeCase from 'util/snakeCase';

class RequestData {
  constructor(fogConnector) {
    this.fogConnector = fogConnector;
  }

  async execute(id, sensorIds) {
    await this.fogConnector.requestData(id, convertToSnakeCase(sensorIds));
  }
}

export default RequestData;
