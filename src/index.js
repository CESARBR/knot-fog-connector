/* eslint-disable no-console */
// Infrastructure
import SettingsFactory from 'data/SettingsFactory';
import DeviceStore from 'data/DeviceStore';
import CloudConnectorFactory from 'network/CloudConnectorFactory';
import CloudConnectionHandler from 'network/CloudConnectionHandler';
import FogConnectorFactory from 'network/FogConnectorFactory';
import FogConnectionHandler from 'network/FogConnectionHandler';
import DevicesPolling from 'network/DevicesPolling';
import AMQPConnectionFactory from 'network/AMQPConnectionFactory';
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
    const fog = new FogConnectorFactory(settings.fog).create();

    await fog.connect();
    await cloud.start();

    if (settings.runAs.enabled) {
      process.setgid(settings.runAs.group);
      process.setuid(settings.runAs.user);
    }

    const amqpConnection = new AMQPConnectionFactory(settings.rabbitMQ).create();
    const cloudConnectionHandler = new CloudConnectionHandler(cloud, amqpConnection);
    const fogConnectionHandler = new FogConnectionHandler(fog, amqpConnection);
    const devicesPolling = new DevicesPolling(fog, cloud, amqpConnection);
    const messageHandler = new MessageHandlerFactory(
      deviceStore,
      cloud,
      fog,
      amqpConnection,
    ).create();

    await messageHandler.start();
    await cloudConnectionHandler.start();
    await fogConnectionHandler.start();
    await devicesPolling.start();
  } catch (err) {
    logger.error(err.stack);
  }
}

main();
