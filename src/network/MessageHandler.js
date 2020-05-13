import _ from 'lodash';
import logger from 'util/logger';

const exchangeConnectorIn = 'connIn';

class MessageHandler {
  constructor(devicesService, dataService, amqpConnection, amqpChannel) {
    this.devicesService = devicesService;
    this.dataService = dataService;
    this.amqpConnection = amqpConnection;
    this.amqpChannel = amqpChannel;
    this.handlers = this.mapMessageHandlers();
  }

  mapMessageHandlers() {
    return {
      [exchangeConnectorIn]: {
        'device.register': {
          method: this.devicesService.register.bind(this.devicesService),
          noAck: true,
          exchangeType: 'topic',
        },
        'device.unregister': {
          method: this.devicesService.unregister.bind(this.devicesService),
          noAck: true,
          exchangeType: 'topic',
        },
        'schema.update': {
          method: this.devicesService.updateSchema.bind(this.devicesService),
          noAck: true,
          exchangeType: 'topic',
        },
        'data.publish': {
          method: this.dataService.publish.bind(this.dataService),
          noAck: true,
          exchangeType: 'topic',
        },
      },
      control: {
        disconnected: {
          method: this.handleDisconnected.bind(this),
          noAck: false,
          exchangeType: 'topic',
        },
        reconnected: {
          method: this.handleReconnected.bind(this),
          noAck: false,
          exchangeType: 'topic',
        },
      },
    };
  }

  parseBuffer(buffer) {
    return JSON.parse(buffer.toString('utf-8'));
  }

  getHandler(type, key) {
    if (!this.handlers[type][key]) {
      logger.error(Error(`Unknown event type ${type}.${key}`));
      return null;
    }
    return this.handlers[type][key].method;
  }

  isNoAck(type, key) {
    return this.handlers[type][key].noAck;
  }

  async handleDisconnected() {
    _.keys(this.handlers[exchangeConnectorIn]).forEach(async (key) => {
      await this.amqpConnection.cancelConsume(this.handlers[exchangeConnectorIn][key].consumerTag);
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

    if (handler) {
      logger.debug(`Receive message ${exchange}.${routingKey}`);
      logger.debug(JSON.stringify(data));
      try {
        await handler(data);
        if (!this.isNoAck(exchange, routingKey)) {
          this.amqpChannel.ack(msg);
        }
      } catch (err) {
        logger.error(err.stack);
        if (!this.isNoAck(exchange, routingKey)) {
          this.amqpChannel.nack(msg);
        }
      }
    }
  }

  async listenToQueueMessages(type) {
    _.keys(this.handlers[type]).forEach(async (key) => {
      const { noAck, exchangeType } = this.handlers[type][key];
      const { consumerTag } = await this.amqpConnection.onMessage(
        type, exchangeType, key, this.handleMessage.bind(this), noAck,
      );
      this.handlers[type][key].consumerTag = consumerTag;
    });
  }

  async start() {
    await this.devicesService.load();

    _.keys(this.handlers).forEach(async (key) => {
      await this.listenToQueueMessages(key);
    });
  }
}

export default MessageHandler;
