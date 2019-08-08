class DataService {
  constructor(
    publishDataInteractor,
  ) {
    this.publishDataInteractor = publishDataInteractor;
  }

  async publish({ id, payload }) {
    await this.publishDataInteractor.execute(id, payload);
  }
}

export default DataService;
