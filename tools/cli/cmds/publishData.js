/* eslint-disable no-console */
const yargs = require('yargs');
const isBase64 = require('is-base64');
const amqplib = require('amqplib/callback_api');

const extractData = args => ({
  id: args['device-id'],
  data: [{
    sensorId: args['sensor-id'],
    value: args.value,
  }],
});

const publishData = (args) => {
  const topic = 'cloud';
  const key = 'data.publish';
  amqplib.connect(`amqp://${args.hostname}:${args.port}`, (connectionErr, connection) => {
    if (connectionErr) {
      throw connectionErr;
    }

    connection.createChannel((channelErr, channel) => {
      if (channelErr) {
        throw channelErr;
      }

      channel.assertExchange(topic, 'topic', { durable: true });
      channel.publish(
        topic,
        key,
        Buffer.from(JSON.stringify(extractData(args))),
        { persistent: true },
      );

      setTimeout(() => {
        connection.close();
        process.exit(0);
      }, 500);
    });
  });
};

yargs
  .command({
    command: 'publish-data <device-id> <sensor-id> <value>',
    desc: 'Publish <value> as a <sensor-id>',
    builder: (_yargs) => {
      _yargs
        .positional('device-id', {
          describe: 'thing\'s ID',
        })
        .positional('sensor-id', {
          describe: 'ID of the sensor that is publishing the data',
        })
        .positional('value', {
          describe: 'Value to be published. Supported types: boolean, number or Base64 strings.',
          coerce: (value) => {
            if (isNaN(value)) { // eslint-disable-line no-restricted-globals
              if (value === 'true' || value === 'false') {
                return (value === 'true');
              }
              if (!isBase64(value)) {
                throw new Error('Supported types are boolean, number or Base64 strings');
              }
              return value;
            }

            return parseFloat(value);
          },
        });
    },
    handler: (args) => {
      publishData(args);
    },
  });
