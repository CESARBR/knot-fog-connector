import logger from 'util/logger';

class FogConnectionHandler {
  constructor(fog, devicesService, dataService) {
    this.fog = fog;
    this.devicesService = devicesService;
    this.dataService = dataService;
  }

  async start() {
    this.fog.on('config', this.onConfigReceived);
    this.fog.on('message', this.onMessageReceived);
  }

  async onConfigReceived(device) {
    try {
      logger.debug('Receive fog changes');
      logger.debug(`Device ${device.id} has changed`);
      await this.devicesService.updateChanges(device);
    } catch (err) {
      logger.error(err);
    }
  }

  async onMessageReceived(msg) {
    try {
      logger.debug(`Receive fog message from ${msg.fromId}`);
      logger.debug(`Payload message: ${msg.payload}`);
      await this.dataService.publish(msg.fromId, msg.payload);
    } catch (err) {
      logger.error(err);
    }
  }
}

export default FogConnectionHandler;
