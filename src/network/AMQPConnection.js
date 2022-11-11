import amqplib from 'amqp-connection-manager';
import logger from 'util/logger';

class AMQPConnection {
  constructor(settings) {
    this.url = `amqp://${settings.username}:${settings.password}@${settings.hostname}:${settings.port}`;
    this.listeners = [];
  }

  async start() {
    return new Promise(async (resolve) => {
      const connection = await amqplib.connect([this.url]);
      connection.createChannel({
        json: true,
        setup: (channel) => {
          logger.debug(
            'Connection established with RabbitMQ. New channel created.'
          );
          this.channel = channel;
          this.subscribeListeners();
          resolve(channel);
        },
      });
      connection.on('error', () =>{
        logger.debug('Disconnected from RabbitMQ, trying to reconnect.')
        setTimeout(() => {
          this.start();
        }, 1000)
      });
      connection.on('close', () =>{
        logger.debug('Disconnected from RabbitMQ, trying to reconnect.')
        setTimeout(() => {
          this.start();
        }, 1000)
      });
    });
  }

  async send(exchangeName, exchangeType, key, message, headers, expiration) {
    await this.channel.assertExchange(exchangeName, exchangeType, {
      durable: true,
    });
    await this.channel.publish(
      exchangeName,
      key,
      Buffer.from(JSON.stringify(message)),
      { persistent: true, expiration, headers }
    );
  }

  async addListener(type, exchangeType, key, handler, noAck) {
    this.listeners.push({
      type,
      exchangeType,
      key,
      handler,
      noAck,
    });
  }

  async subscribeListeners() {
    this.listeners.forEach(async (listener, index) => {
      const { consumerTag } = await this.onMessage(
        listener.type,
        listener.exchangeType,
        listener.key,
        listener.handler,
        listener.noAck
      );
      this.listeners[index].consumerTag = consumerTag;
    });
  }

  async onMessage(exchangeName, exchangeType, key, callback, noAck) {
    await this.channel.assertExchange(exchangeName, exchangeType, {
      durable: true,
    });

    const { queue } = await this.channel.assertQueue(
      `connector-event-${exchangeName}`,
      {
        durable: true,
      }
    );
    await this.channel.bindQueue(queue, exchangeName, key);
    return this.channel.consume(queue, callback, { noAck });
  }

  async cancelAllConsumes(type) {
    this.listeners.map(async (listener) => {
      if (listener.type === type) {
        await this.channel.cancel(listener.consumerTag);
      }
    });
  }

  ack(msg) {
    this.channel.ack(msg);
  }

  nack(msg) {
    this.channel.nack(msg);
  }
}

export default AMQPConnection;
