import convertToSnakeCase from 'util/snakeCase';

class UpdateData {
  constructor(fogConnector) {
    this.fogConnector = fogConnector;
  }

  async execute(id, data) {
    await this.fogConnector.setData(id, convertToSnakeCase(data));
  }
}

export default UpdateData;
