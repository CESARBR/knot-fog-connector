class PublishData {
  constructor(cloudConnector) {
    this.cloudConnector = cloudConnector;
  }

  async execute(id, data) {
    await this.cloudConnector.publishData(id, data);
  }
}

export default PublishData;
