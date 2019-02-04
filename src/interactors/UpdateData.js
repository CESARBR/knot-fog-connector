class UpdateData {
  constructor(fogConnector) {
    this.fogConnector = fogConnector;
  }

  async execute(id, sensorId, data) {
    await this.fogConnector.setData(id, sensorId, data);
  }
}

export default UpdateData;
