import logger from 'util/logger';

class FogConnectionHandler {
  constructor(fog, queue) {
    this.fog = fog;
    this.queue = queue;
  }

  async start() {
    this.fog.on('config', this.onConfigReceived);
    this.fog.on('message', this.onMessageReceived);
  }

  async onConfigReceived(device) {
    try {
      logger.debug('Receive fog changes');
      logger.debug(`Device ${device.id} has changed`);
      await this.queue.send('cloud', 'config.update');
    } catch (err) {
      logger.error(err);
    }
  }

  async onMessageReceived(msg) {
    try {
      logger.debug(`Receive fog message from ${msg.fromId}`);
      logger.debug(`Payload message: ${msg.payload}`);
      await this.queue.publish('cloud', 'data.publish');
    } catch (err) {
      logger.error(err);
    }
  }
}

export default FogConnectionHandler;
