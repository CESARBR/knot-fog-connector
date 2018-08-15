class DataService {
  constructor(
    updateDataInteractor,
    updateConfigInteractor,
    updatePropertiesInteractor,
    requestDataInteractor,
    publishDataInteractor,
  ) {
    this.updateDataInteractor = updateDataInteractor;
    this.updateConfigInteractor = updateConfigInteractor;
    this.updatePropertiesInteractor = updatePropertiesInteractor;
    this.requestDataInteractor = requestDataInteractor;
    this.publishDataInteractor = publishDataInteractor;
  }

  async update(id, sensorId, data) {
    await this.updateDataInteractor.execute(id, sensorId, data);
  }

  async updateConfig(id, config) {
    await this.updateConfigInteractor.execute(id, config);
  }

  async updateProperties(id, properties) {
    await this.updatePropertiesInteractor.execute(id, properties);
  }

  async request(id, sensorId) {
    await this.requestDataInteractor.execute(id, sensorId);
  }

  async publish(id, data) {
    await this.publishDataInteractor.execute(id, data);
  }
}

export default DataService;
