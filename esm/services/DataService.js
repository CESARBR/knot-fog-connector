class DataService {
  constructor(updateDataInteractor, updateConfigInteractor, requestDataInteractor) {
    this.updateDataInteractor = updateDataInteractor;
    this.updateConfigInteractor = updateConfigInteractor;
    this.requestDataInteractor = requestDataInteractor;
  }

  async update(id, sensorId, data) {
    await this.updateDataInteractor.execute(id, sensorId, data);
  }

  async updateConfig(id, config) {
    await this.updateConfigInteractor.execute(id, config);
  }

  async request(id, sensorId) {
    await this.requestDataInteractor.execute(id, sensorId);
  }
}

export default DataService;
