import logger from 'util/logger';
import _ from 'lodash';

class FogConnectionHandler {
  constructor(fog, queue) {
    this.fog = fog;
    this.queue = queue;
  }

  async start() {
    this.fog.on('message', this.onMessageReceived.bind(this));
  }

  async onMessageReceived(msg) {
    try {
      logger.debug(`Receive fog message from ${msg.fromId}`);
      logger.debug(`Payload message: ${msg.payload}`);
      if (!_.has(msg.payload, 'online')) { // Ignore fog online message broadcast
        await this.queue.send('cloud', 'data.publish', { id: msg.fromId, payload: msg.payload });
      }
    } catch (err) {
      logger.error(err.stack);
    }
  }
}

export default FogConnectionHandler;
