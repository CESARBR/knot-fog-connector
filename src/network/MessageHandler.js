import _ from 'lodash';
import logger from 'util/logger';

class MessageHandler {
  constructor(devicesService, dataService, queue) {
    this.devicesService = devicesService;
    this.dataService = dataService;
    this.queue = queue;
    this.handlers = {
      cloud: {
        'device.register': this.devicesService.register.bind(this.devicesService),
        'device.unregister': this.devicesService.unregister.bind(this.devicesService),
        'schema.update': this.devicesService.updateSchema.bind(this.devicesService),
        'data.publish': this.dataService.publish.bind(this.dataService),
        'config.update': this.devicesService.updateChanges.bind(this.devicesService),
      },
      fog: {
        'data.update': this.dataService.update.bind(this.dataService),
        'data.request': this.dataService.request.bind(this.dataService),
      },
    };
  }

  parseBuffer(buffer) {
    return JSON.parse(buffer.toString('utf-8'));
  }

  getHandler(type, key) {
    if (!this.handlers[type][key]) {
      throw new Error(`Unknown event type ${type}.${key}`);
    }
    return this.handlers[type][key];
  }

  async handleMessage(msg) {
    const { content, fields } = msg;
    const data = this.parseBuffer(content);
    const { exchange, routingKey } = fields;
    const handler = this.getHandler(exchange, routingKey);

    logger.debug(`Receive message ${exchange}.${routingKey}`);
    logger.debug(JSON.stringify(data));
    try {
      await handler(data);
      this.channel.ack(msg);
    } catch (err) {
      logger.error(err);
      this.channel.nack(msg);
    }
  }

  async listenToQueueMessages() {
    const types = _.keys(this.handlers);
    types.forEach((type) => {
      _.keys(this.handlers[type]).forEach(async (key) => {
        // TODO: if receive disconnection stop to listen to queue
        await this.queue.onMessage(type, key, this.handleMessage.bind(this));
      });
    });
  }

  async start() {
    await this.devicesService.load();
    this.channel = await this.queue.start();
    await this.listenToQueueMessages();
  }
}

export default MessageHandler;
