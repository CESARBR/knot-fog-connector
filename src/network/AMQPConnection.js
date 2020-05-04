import amqplib from 'amqp-connection-manager';

class AMQPConnection {
  constructor(settings) {
    this.url = `amqp://${settings.username}:${settings.password}@${settings.hostname}:${settings.port}`;
  }

  async start() {
    return new Promise(async (resolve) => {
      const connection = await amqplib.connect([this.url]);
      connection.createChannel({
        json: true,
        setup: (channel) => {
          this.channel = channel;
          resolve(channel);
        },
      });
    });
  }

  async send(exchangeName, exchangeType, key, message, headers, expiration) {
    await this.channel.assertExchange(exchangeName, exchangeType, { durable: true });
    await this.channel.publish(
      exchangeName,
      key,
      Buffer.from(JSON.stringify(message)),
      { persistent: true, expiration, headers },
    );
  }

  async onMessage(exchangeName, exchangeType, key, callback, noAck) {
    await this.channel.assertExchange(exchangeName, exchangeType, { durable: true });
    const { queue } = await this.channel.assertQueue(`${exchangeName}-messages`, { durable: true });
    await this.channel.bindQueue(queue, exchangeName, key);
    return this.channel.consume(queue, callback, { noAck });
  }

  async cancelConsume(consumerTag) {
    await this.channel.cancel(consumerTag);
  }
}

export default AMQPConnection;
