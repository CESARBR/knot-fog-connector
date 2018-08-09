class DataService {
  constructor(updateDataInteractor) {
    this.updateDataInteractor = updateDataInteractor;
  }

  async update(id, sensorId, data) {
    await this.updateDataInteractor.execute(id, sensorId, data);
  }
}

export default DataService;
