/* eslint-disable no-console */
const yargs = require('yargs');
const amqpConnection = require('./../network/connection').connection;

const deleteThing = (args) => {
  const topic = 'cloud';
  const key = 'device.unregister';

  amqpConnection(args.hostname, args.port, topic, (connection, channel) => {
    channel.publish(
      topic,
      key,
      Buffer.from(JSON.stringify({ id: args.id })),
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
    command: 'delete-thing <id>',
    desc: 'Unregisters a thing',
    handler: (args) => {
      deleteThing(args);
    },
  });
