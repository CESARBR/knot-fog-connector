import logger from 'util/logger';
import convertToCamelCase from 'util/camelCase';

class PublishData {
  constructor(cloudConnector) {
    this.cloudConnector = cloudConnector;
  }

  async execute(id, data) {
    try {
      await this.cloudConnector.publishData(
        id,
        data.map((d) => convertToCamelCase(d))
      );
      logger.debug(`Device ${id} data sent`);
    } catch (err) {
      logger.error(err.message);
    }
  }
}

export default PublishData;
