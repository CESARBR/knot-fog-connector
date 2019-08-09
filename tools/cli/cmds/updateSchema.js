/* eslint-disable no-console */
const yargs = require('yargs');
const amqpConnection = require('./../network/connection').connection;
const schema = require('./defaultSchema');

const updateSchema = (args) => {
  const topic = 'cloud';
  const key = 'schema.update';

  amqpConnection(args.hostname, args.port, topic, (connection, channel) => {
    channel.publish(
      topic,
      key,
      Buffer.from(JSON.stringify({ id: args.id, schema: [schema] })),
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
    command: 'update-schema <id>',
    desc: 'Updates thing\'s schema',
    handler: (args) => {
      updateSchema(args);
    },
  });
