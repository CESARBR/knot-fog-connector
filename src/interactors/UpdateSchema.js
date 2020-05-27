import logger from 'util/logger';
import convertToCamelCase from 'util/camelCase';

class UpdateSchema {
  constructor(cloudConnector) {
    this.cloudConnector = cloudConnector;
  }

  async execute(device) {
    try {
      await this.cloudConnector.updateSchema(
        device.id,
        convertToCamelCase(device.schema)
      );
      logger.debug(`Device ${device.id} schema updated`);
    } catch (err) {
      logger.error(err.message);
    }
  }
}

export default UpdateSchema;
