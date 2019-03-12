class DataService {
  constructor(
    updateDataInteractor,
    requestDataInteractor,
    publishDataInteractor,
  ) {
    this.updateDataInteractor = updateDataInteractor;
    this.requestDataInteractor = requestDataInteractor;
    this.publishDataInteractor = publishDataInteractor;
  }

  async update(id, data) {
    await this.updateDataInteractor.execute(id, data);
  }

  async request(id, sensorIds) {
    await this.requestDataInteractor.execute(id, sensorIds);
  }

  async publish(id, data) {
    await this.publishDataInteractor.execute(id, data);
  }
}

export default DataService;
