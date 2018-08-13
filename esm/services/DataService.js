class DataService {
  constructor(updateDataInteractor, requestDataInteractor) {
    this.updateDataInteractor = updateDataInteractor;
    this.requestDataInteractor = requestDataInteractor;
  }

  async update(id, sensorId, data) {
    await this.updateDataInteractor.execute(id, sensorId, data);
  }

  async request(id, sensorId) {
    await this.requestDataInteractor.execute(id, sensorId);
  }
}

export default DataService;
