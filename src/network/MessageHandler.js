import _ from 'lodash';
import logger from 'util/logger';

const deviceExchange = 'device';
const publishDataExchange = 'data.published';

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
      [deviceExchange]: {
        'device.registered': {
          method: ({ error, ...message }) => {
            if (!error) {
              this.devicesService.register(message);
            }
          },
          noAck: true,
          exchangeType: 'direct',
        },
        'device.unregistered': {
          method: ({ error, ...message }) => {
            if (!error) {
              this.devicesService.unregister(message);
            }
          },
          noAck: true,
          exchangeType: 'direct',
        },
        'device.schema.updated': {
          method: ({ error, ...message }) => {
            if (!error) {
              this.devicesService.updateSchema(message);
            }
          },
          noAck: true,
          exchangeType: 'direct',
        },
      },
      [publishDataExchange]: {
        '': {
          method: (message) => {
            this.dataService.publish(message);
          },
          noAck: true,
          exchangeType: 'fanout',
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
    _.keys(this.handlers[deviceExchange]).forEach(async (key) => {
      await this.amqpConnection.cancelConsume(this.handlers[deviceExchange][key].consumerTag);
    });
  }

  async handleReconnected() {
    await this.listenToQueueMessages(deviceExchange);
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
    _.keys(this.handlers).forEach(async (key) => {
      await this.listenToQueueMessages(key);
    });
  }
}

export default MessageHandler;
