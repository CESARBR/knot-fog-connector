class RequestData {
  constructor(fogConnector) {
    this.fogConnector = fogConnector;
  }

  async execute(id, sensorId) {
    await this.fogConnector.requestData(id, sensorId);
  }
}

export default RequestData;
