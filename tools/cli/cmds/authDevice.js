/* eslint-disable no-console */
const yargs = require('yargs');
const amqpConnection = require('./../network/connection').connection;

const authDevice = (args) => {
  const topic = 'cloud';
  const key = 'device.cmd.auth';

  amqpConnection(args.hostname, args.port, topic, (connection, channel) => {
    channel.publish(
      topic,
      key,
      Buffer.from(JSON.stringify({ id: args.id, token: args.token })),
      { persistent: true },
    );

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  });
};

yargs
  .command({
    command: 'auth-device <id> <token>',
    desc: 'Authenticate a device',
    handler: (args) => {
      authDevice(args);
    },
  });
