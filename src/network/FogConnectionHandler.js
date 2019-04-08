import logger from 'util/logger';
import _ from 'lodash';

class FogConnectionHandler {
  constructor(fog, queue) {
    this.fog = fog;
    this.queue = queue;
  }

  async start() {
    this.fog.on('config', this.onConfigReceived.bind(this));
    this.fog.on('message', this.onMessageReceived.bind(this));
  }

  async onConfigReceived(device) {
    try {
      logger.debug('Receive fog changes');
      logger.debug(`Device ${device.id} has changed`);
      await this.queue.send('cloud', 'config.update', device);
    } catch (err) {
      logger.error(err);
    }
  }

  async onMessageReceived(msg) {
    try {
      logger.debug(`Receive fog message from ${msg.fromId}`);
      logger.debug(`Payload message: ${msg.payload}`);
      if (_.has(msg.payload, 'online')) { // The fog emits a broadcast saying that the online was updated
        await this.queue.send('cloud', 'config.update', { id: msg.fromId, online: msg.payload.online });
      } else {
        await this.queue.send('cloud', 'data.publish', { id: msg.fromId, payload: msg.payload });
      }
    } catch (err) {
      logger.error(err);
    }
  }
}

export default FogConnectionHandler;
