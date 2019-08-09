/* eslint-disable no-console */
const yargs = require('yargs');
const amqpConnection = require('./../network/connection').connection;

const onMessage = (channel, topic, key, callback) => {
  const { queue } = channel.assertQueue(`${topic}-messages`, { durable: true });
  channel.bindQueue(queue, topic, key);
  return channel.consume(queue, callback);
};

const parseBuffer = buffer => JSON.parse(buffer.toString('utf-8'));

const listenCommands = (args) => {
  const topic = 'fog';
  const commands = ['data.update', 'data.request'];

  amqpConnection(args.hostname, args.port, topic, (connection, channel) => {
    commands.forEach((cmd) => {
      onMessage(channel, topic, cmd, (message) => {
        const { content, fields } = message;
        console.log(`Command received: ${fields.routingKey}`);
        console.log(JSON.stringify(parseBuffer(content)));
        channel.ack(message);
      });
    });
  });
};

yargs
  .command({
    command: 'listen-commands',
    desc: 'Listen to commands from cloud',
    handler: (args) => {
      listenCommands(args);
    },
  });
