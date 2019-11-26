import MessageHandler from 'network/MessageHandler';

import LoadDevices from 'interactors/LoadDevices';
import RegisterDevice from 'interactors/RegisterDevice';
import UnregisterDevice from 'interactors/UnregisterDevice';
import AuthDevice from 'interactors/AuthDevice';
import ListDevices from 'interactors/ListDevices';
import UpdateSchema from 'interactors/UpdateSchema';
import DevicesService from 'services/DevicesService';

import PublishData from 'interactors/PublishData';
import DataService from 'services/DataService';

class MessageHandlerFactory {
  constructor(deviceStore, cloud, amqpConnection, publisher) {
    this.deviceStore = deviceStore;
    this.cloud = cloud;
    this.amqpConnection = amqpConnection;
    this.publisher = publisher;
  }

  create() {
    const {
      deviceStore, cloud, amqpConnection, publisher,
    } = this;

    const loadDevices = new LoadDevices(deviceStore, cloud);
    const registerDevice = new RegisterDevice(deviceStore, cloud, publisher);
    const unregisterDevice = new UnregisterDevice(deviceStore, cloud, publisher);
    const authDevice = new AuthDevice(cloud, publisher);
    const updateSchema = new UpdateSchema(deviceStore, cloud, publisher);
    const listDevices = new ListDevices(cloud, publisher);
    const devicesService = new DevicesService(
      loadDevices,
      registerDevice,
      unregisterDevice,
      authDevice,
      listDevices,
      updateSchema,
    );

    const publishData = new PublishData(deviceStore, cloud);
    const dataService = new DataService(
      publishData,
    );

    return new MessageHandler(
      devicesService,
      dataService,
      amqpConnection,
    );
  }
}

export default MessageHandlerFactory;
