/* eslint-disable no-console */
// Infrastructure
import SettingsFactory from 'data/SettingsFactory';
import DeviceStore from 'data/DeviceStore';
import CloudConnectorFactory from 'network/CloudConnectorFactory';
import CloudConnectionHandler from 'network/CloudConnectionHandler';
import AMQPConnectionFactory from 'network/AMQPConnectionFactory';
import MessagePublisher from 'network/MessagePublisher';
import MessageHandlerFactory from 'network/MessageHandlerFactory';

// Logger
import logger from 'util/logger';

async function main() {
  logger.info('KNoT Fog Connnector started');

  try {
    const settings = new SettingsFactory().create();
    const deviceStore = new DeviceStore();

    logger.info(`Connecting to '${settings.cloudType}' cloud`);
    const cloud = CloudConnectorFactory.create(settings.cloudType, settings.cloud);

    await cloud.start();

    if (settings.runAs.enabled) {
      process.setgid(settings.runAs.group);
      process.setuid(settings.runAs.user);
    }

    const amqpConnection = new AMQPConnectionFactory(settings.rabbitMQ).create();
    const publisher = new MessagePublisher(amqpConnection);
    const cloudConnectionHandler = new CloudConnectionHandler(cloud, publisher);
    const messageHandler = new MessageHandlerFactory(
      deviceStore,
      cloud,
      amqpConnection,
      publisher,
    ).create();

    await messageHandler.start();
    await cloudConnectionHandler.start();
  } catch (err) {
    logger.error(err.stack);
  }
}

main();
