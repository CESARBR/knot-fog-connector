import logger from 'util/logger';

class CloudConnectionHandler {
  constructor(cloud, dataService) {
    this.cloud = cloud;
    this.dataService = dataService;
  }

  async start() {
    this.cloud.onDataUpdated(this.onDataUpdated.bind(this));
    this.cloud.onDataRequested(this.onDataRequested.bind(this));
  }

  async onDataUpdated(id, data) {
    data.forEach(({ sensorId, value }) => {
      logger.debug(`Update data from ${sensorId} of thing ${id}: ${value}`);
    });
    await this.dataService.update(id, data);
  }

  async onDataRequested(id, sensorIds) {
    logger.debug(`Data requested from ${sensorIds} of thing ${id}`);
    await this.dataService.request(id, sensorIds);
  }
}

export default CloudConnectionHandler;
