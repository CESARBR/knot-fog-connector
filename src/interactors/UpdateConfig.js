import logger from 'util/logger';

class UpdateConfig {
  constructor(cloudConnector) {
    this.cloudConnector = cloudConnector;
  }

  async execute(updatedDevice) {
    try {
      await this.cloudConnector.updateConfig(
        updatedDevice.id,
        updatedDevice.config
      );
      logger.debug(`Device ${updatedDevice.id} config updated`);
    } catch (err) {
      logger.error(err.message);
    }
  }
}

export default UpdateConfig;
