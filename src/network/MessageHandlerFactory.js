import MessageHandler from 'network/MessageHandler';

import LoadDevices from 'interactors/LoadDevices';
import UpdateChanges from 'interactors/UpdateChanges';
import RegisterDevice from 'interactors/RegisterDevice';
import UnregisterDevice from 'interactors/UnregisterDevice';
import UpdateSchema from 'interactors/UpdateSchema';
import DevicesService from 'services/DevicesService';

import UpdateData from 'interactors/UpdateData';
import RequestData from 'interactors/RequestData';
import PublishData from 'interactors/PublishData';
import DataService from 'services/DataService';

class MessageHandlerFactory {
  constructor(deviceStore, cloud, fog, amqpConnection) {
    this.deviceStore = deviceStore;
    this.cloud = cloud;
    this.fog = fog;
    this.amqpConnection = amqpConnection;
  }

  create() {
    const {
      deviceStore, cloud, fog, amqpConnection,
    } = this;

    const loadDevices = new LoadDevices(deviceStore, cloud, fog);
    const updateChanges = new UpdateChanges(deviceStore, cloud);
    const registerDevice = new RegisterDevice(deviceStore, fog, cloud);
    const unregisterDevice = new UnregisterDevice(deviceStore, cloud);
    const updateSchema = new UpdateSchema(deviceStore, cloud);
    const devicesService = new DevicesService(
      loadDevices,
      updateChanges,
      registerDevice,
      unregisterDevice,
      updateSchema,
    );
    const updateData = new UpdateData(fog);
    const requestData = new RequestData(fog);
    const publishData = new PublishData(deviceStore, cloud);
    const dataService = new DataService(
      updateData,
      requestData,
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
