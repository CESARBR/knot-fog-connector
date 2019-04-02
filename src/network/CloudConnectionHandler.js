import logger from 'util/logger';

class CloudConnectionHandler {
  constructor(cloud, queue) {
    this.cloud = cloud;
    this.queue = queue;
  }

  async start() {
    this.cloud.onDataUpdated(this.onDataUpdated.bind(this));
    this.cloud.onDataRequested(this.onDataRequested.bind(this));
  }

  async onDataUpdated(id, data) {
    data.forEach(({ sensorId, value }) => {
      logger.debug(`Update data from ${sensorId} of thing ${id}: ${value}`);
    });

    await this.queue.send('fog', 'data.update', { id, data });
  }

  async onDataRequested(id, sensorIds) {
    logger.debug(`Data requested from ${sensorIds} of thing ${id}`);
    await this.queue.send('fog', 'data.request', { id, sensorIds });
  }
}

export default CloudConnectionHandler;
