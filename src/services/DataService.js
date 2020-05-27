class DataService {
  constructor(publishDataInteractor) {
    this.publishDataInteractor = publishDataInteractor;
  }

  async publish({ id, data }) {
    await this.publishDataInteractor.execute(id, data);
  }
}

export default DataService;
