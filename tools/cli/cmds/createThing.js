/* eslint-disable no-console */
const yargs = require('yargs');
const amqpConnection = require('./../network/connection').connection;

const createThing = (args) => {
  const topic = 'cloud';
  const key = 'device.register';

  amqpConnection(args.hostname, args.port, topic, (connection, channel) => {
    channel.publish(
      topic,
      key,
      Buffer.from(JSON.stringify({ id: args.id, name: args.name })),
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
    command: 'create-thing <id> <name>',
    desc: 'Create a thing',
    handler: (args) => {
      createThing(args);
    },
  });
