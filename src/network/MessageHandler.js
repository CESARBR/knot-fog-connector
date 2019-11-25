import _ from 'lodash';
import logger from 'util/logger';

const exchangeConnectorIn = 'connIn';

class MessageHandler {
  constructor(devicesService, dataService, queue) {
    this.devicesService = devicesService;
    this.dataService = dataService;
    this.queue = queue;
    this.handlers = this.mapMessageHandlers();
  }

  mapMessageHandlers() {
    return {
      [exchangeConnectorIn]: {
        'device.register': {
          method: this.devicesService.register.bind(this.devicesService),
          noAck: true,
        },
        'device.unregister': {
          method: this.devicesService.unregister.bind(this.devicesService),
          noAck: true,
        },
        'device.cmd.auth': {
          method: this.devicesService.auth.bind(this.devicesService),
          noAck: true,
        },
        'device.cmd.list': {
          method: this.devicesService.list.bind(this.devicesService),
          noAck: true,
        },
        'schema.update': {
          method: this.devicesService.updateSchema.bind(this.devicesService),
          noAck: true,
        },
        'data.publish': {
          method: this.dataService.publish.bind(this.dataService),
          noAck: true,
        },
      },
      control: {
        disconnected: {
          method: this.handleDisconnected.bind(this),
          noAck: false,
        },
        reconnected: {
          method: this.handleReconnected.bind(this),
          noAck: false,
        },
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
    return this.handlers[type][key].method;
  }

  isNoAck(type, key) {
    return this.handlers[type][key].noAck;
  }

  async handleDisconnected() {
    _.keys(this.handlers[exchangeConnectorIn]).forEach(async (key) => {
      await this.queue.cancelConsume(this.handlers[exchangeConnectorIn][key].consumerTag);
    });
  }

  async handleReconnected() {
    await this.listenToQueueMessages(exchangeConnectorIn);
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
      if (!this.isNoAck(exchange, routingKey)) {
        this.channel.ack(msg);
      }
    } catch (err) {
      logger.error(err.stack);
      if (!this.isNoAck(exchange, routingKey)) {
        this.channel.nack(msg);
      }
    }
  }

  async listenToQueueMessages(type) {
    _.keys(this.handlers[type]).forEach(async (key) => {
      const { noAck } = this.handlers[type][key];
      const { consumerTag } = await this.queue.onMessage(
        type, key, this.handleMessage.bind(this), noAck,
      );
      this.handlers[type][key].consumerTag = consumerTag;
    });
  }

  async start() {
    await this.devicesService.load();
    await this.queue.start((channel) => {
      logger.info('Connected to RabbitMQ');
      this.channel = channel;
      _.keys(this.handlers).forEach(async (key) => {
        await this.listenToQueueMessages(key);
      });
    });
  }
}

export default MessageHandler;
