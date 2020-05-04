import convertToCamelCase from 'util/camelCase';

class PublishData {
  constructor(cloudConnector) {
    this.cloudConnector = cloudConnector;
  }

  async execute(id, data) {
    await this.cloudConnector.publishData(id, data.map(d => convertToCamelCase(d)));
  }
}

export default PublishData;
