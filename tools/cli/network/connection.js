const amqplib = require('amqplib/callback_api');

module.exports.connection = (hostname, port, topic, cb) => {
  amqplib.connect(`amqp://${hostname}:${port}`, (connectionErr, connection) => {
    if (connectionErr) {
      throw connectionErr;
    }
    connection.createChannel((channelErr, channel) => {
      if (channelErr) {
        throw channelErr;
      }
      channel.assertExchange(topic, 'topic', { durable: true });
      cb(connection, channel);
    });
  });
};
