import logger from 'util/logger';
import convertToCamelCase from 'util/camelCase';

class UpdateSchema {
  constructor(deviceStore, cloudConnector) {
    this.deviceStore = deviceStore;
    this.cloudConnector = cloudConnector;
  }

  async execute(device) {
    logger.debug(`Device ${device.id} schema updated`);
    await this.deviceStore.update(device.id, { schema: convertToCamelCase(device.schema) });
    await this.cloudConnector.updateSchema(device.id, convertToCamelCase(device.schema));
  }
}

export default UpdateSchema;
