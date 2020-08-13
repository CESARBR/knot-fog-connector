import logger from 'util/logger';

class CloudConnectionHandler {
  constructor(cloud, queue) {
    this.cloud = cloud;
    this.queue = queue;
  }

  async start() {
    this.cloud.onDataUpdated(this.onDataUpdated.bind(this));
    this.cloud.onDataRequested(this.onDataRequested.bind(this));
    this.cloud.onConfigUpdated(this.onConfigUpdated.bind(this));
    this.cloud.onDisconnected(this.onDisconnected.bind(this));
    this.cloud.onReconnected(this.onReconnected.bind(this));
  }

  async onDataUpdated(id, data) {
    data.forEach(({ sensorId, value }) => {
      logger.debug(`Update data from ${sensorId} of thing ${id}: ${value}`);
    });

    await this.queue.sendDataUpdate({ id, data });
  }

  async onDataRequested(id, sensorIds) {
    logger.debug(`Data requested from ${sensorIds} of thing ${id}`);
    await this.queue.sendDataRequest({ id, sensorIds });
  }

  async onConfigUpdated(id, config) {
    logger.debug(`Received config update command to thing ${id}`);
    await this.queue.sendUpdateConfig({ id, config });
  }

  async onDisconnected() {
    logger.debug('Cloud disconnected');
    await this.queue.sendDisconnected();
  }

  async onReconnected() {
    logger.debug('Cloud reconnected');
    await this.queue.sendReconnected();
  }
}

export default CloudConnectionHandler;
