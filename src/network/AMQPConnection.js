import amqplib from 'amqplib';

class AMQPConnection {
  constructor(settings) {
    this.url = `amqp://${settings.hostname}:${settings.port}`;
  }

  async start() {
    const connection = await amqplib.connect(this.url);
    this.channel = await connection.createChannel();
    return this.channel;
  }

  async send(topic, key, message) {
    await this.channel.assertExchange(topic, 'topic', { durable: true });
    await this.channel.publish(topic, key, Buffer.from(JSON.stringify(message)));
  }

  async onMessage(topic, key, callback) {
    await this.channel.assertExchange(topic, 'topic', { durable: true });
    const { queue } = await this.channel.assertQueue(`${topic}-messages`, { durable: true });
    await this.channel.bindQueue(queue, topic, key);
    await this.channel.consume(queue, callback);
  }
}

export default AMQPConnection;
