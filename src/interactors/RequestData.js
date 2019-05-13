class RequestData {
  constructor(fogConnector) {
    this.fogConnector = fogConnector;
  }

  async execute(id, sensorIds) {
    await this.fogConnector.requestData(id, this.mapToFogSensorIds(sensorIds));
  }

  mapToFogSensorIds(sensorIds) {
    return sensorIds.map(sensorId => ({ sensor_id: sensorId }));
  }
}

export default RequestData;
