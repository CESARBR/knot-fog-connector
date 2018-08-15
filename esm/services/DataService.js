class DataService {
  constructor(
    updateDataInteractor,
    updateConfigInteractor,
    updatePropertiesInteractor,
    requestDataInteractor,
  ) {
    this.updateDataInteractor = updateDataInteractor;
    this.updateConfigInteractor = updateConfigInteractor;
    this.updatePropertiesInteractor = updatePropertiesInteractor;
    this.requestDataInteractor = requestDataInteractor;
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
}

export default DataService;
