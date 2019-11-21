/* eslint-disable no-console */
const yargs = require('yargs');
const amqpConnection = require('./../network/connection').connection;

const onMessage = (channel, topic, key, callback) => {
  const { queue } = channel.assertQueue(`${topic}-messages`, { durable: true });
  channel.bindQueue(queue, topic, key);
  return channel.consume(queue, callback);
};

const parseBuffer = buffer => JSON.parse(buffer.toString('utf-8'));

const listDevices = (args) => {
  const topic = 'fog';
  const commands = ['device.list'];

  amqpConnection(args.hostname, args.port, topic, (connection, channel) => {
    channel.publish(
      'cloud',
      'device.cmd.list',
      Buffer.from(JSON.stringify({})),
      { persistent: true },
    );

    commands.forEach((cmd) => {
      onMessage(channel, topic, cmd, (message) => {
        const { content, fields } = message;
        console.log(`Devices received: ${fields.routingKey}`);
        console.log(JSON.stringify(parseBuffer(content)));
        channel.ack(message);
      });
    });
  });
};

yargs
  .command({
    command: 'list-devices',
    desc: 'List devices from cloud',
    handler: (args) => {
      listDevices(args);
    },
  });
