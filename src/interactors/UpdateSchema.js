import logger from 'util/logger';
import convertToCamelCase from 'util/camelCase';

class UpdateSchema {
  constructor(deviceStore, cloudConnector, queue) {
    this.deviceStore = deviceStore;
    this.cloudConnector = cloudConnector;
    this.queue = queue;
  }

  async execute(device) {
    try {
      await this.cloudConnector.updateSchema(device.id, convertToCamelCase(device.schema));
      await this.deviceStore.update(device.id, { schema: convertToCamelCase(device.schema) });
      this.queue.send('fog', 'schema.updated', { id: device.id, error: null });
      logger.debug(`Device ${device.id} schema updated`);
    } catch (error) {
      this.queue.send('fog', 'schema.updated', { id: device.id, error: error.message });
    }
  }
}

export default UpdateSchema;
