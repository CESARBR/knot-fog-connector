import MessageHandler from 'network/MessageHandler';

import RegisterDevice from 'interactors/RegisterDevice';
import UnregisterDevice from 'interactors/UnregisterDevice';
import UpdateConfig from 'interactors/UpdateConfig';
import DevicesService from 'services/DevicesService';

import PublishData from 'interactors/PublishData';
import DataService from 'services/DataService';

class MessageHandlerFactory {
  constructor(cloud, amqpConnection, amqpChannel) {
    this.cloud = cloud;
    this.amqpConnection = amqpConnection;
    this.amqpChannel = amqpChannel;
  }

  create() {
    const { cloud, amqpConnection } = this;

    const registerDevice = new RegisterDevice(cloud);
    const unregisterDevice = new UnregisterDevice(cloud);
    const updateConfig = new UpdateConfig(cloud);
    const devicesService = new DevicesService(
      registerDevice,
      unregisterDevice,
      updateConfig
    );

    const publishData = new PublishData(cloud);
    const dataService = new DataService(publishData);

    return new MessageHandler(
      devicesService,
      dataService,
      amqpConnection,
      this.amqpChannel
    );
  }
}

export default MessageHandlerFactory;
