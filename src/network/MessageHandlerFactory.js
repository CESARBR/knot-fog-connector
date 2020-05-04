import MessageHandler from 'network/MessageHandler';

import RegisterDevice from 'interactors/RegisterDevice';
import UnregisterDevice from 'interactors/UnregisterDevice';
import UpdateSchema from 'interactors/UpdateSchema';
import DevicesService from 'services/DevicesService';

import PublishData from 'interactors/PublishData';
import DataService from 'services/DataService';

class MessageHandlerFactory {
  constructor(cloud, amqpConnection, amqpChannel, publisher) {
    this.cloud = cloud;
    this.amqpConnection = amqpConnection;
    this.amqpChannel = amqpChannel;
    this.publisher = publisher;
  }

  create() {
    const {
      cloud, amqpConnection, publisher,
    } = this;

    const registerDevice = new RegisterDevice(cloud, publisher);
    const unregisterDevice = new UnregisterDevice(cloud, publisher);
    const updateSchema = new UpdateSchema(cloud, publisher);
    const devicesService = new DevicesService(
      registerDevice,
      unregisterDevice,
      updateSchema,
    );

    const publishData = new PublishData(cloud);
    const dataService = new DataService(
      publishData,
    );

    return new MessageHandler(
      devicesService,
      dataService,
      amqpConnection,
      this.amqpChannel,
    );
  }
}

export default MessageHandlerFactory;
