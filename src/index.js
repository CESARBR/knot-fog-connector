/* eslint-disable no-console */
// Infrastructure
import SettingsFactory from 'data/SettingsFactory';
import DeviceStore from 'data/DeviceStore';
import CloudConnectorFactory from 'network/CloudConnectorFactory';
import CloudConnectionHandler from 'network/CloudConnectionHandler';
import FogConnectorFactory from 'network/FogConnectorFactory';
import FogConnectionHandler from 'network/FogConnectionHandler';
import DevicesPolling from 'network/DevicesPolling';

// Domain
import LoadDevices from 'interactors/LoadDevices';
import UpdateChanges from 'interactors/UpdateChanges';
import RegisterDevice from 'interactors/RegisterDevice';
import UnregisterDevice from 'interactors/UnregisterDevice';
import UpdateSchema from 'interactors/UpdateSchema';
import DevicesService from 'services/DevicesService';
import UpdateData from 'interactors/UpdateData';
import RequestData from 'interactors/RequestData';
import DataService from 'services/DataService';
import PublishData from 'interactors/PublishData';

// Logger
import logger from 'util/logger';

const settings = new SettingsFactory().create();
const deviceStore = new DeviceStore();

async function main() {
  logger.info('KNoT Fog Connnector started');

  try {
    const cloud = CloudConnectorFactory.create(settings.cloudType, settings.cloud);
    const fog = new FogConnectorFactory(settings.fog).create();

    await fog.connect();
    await cloud.start();

    if (process.env.NODE_ENV === 'production') {
      process.setgid(settings.runAs.group);
      process.setuid(settings.runAs.user);
    }

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

    const cloudConnectionHandler = new CloudConnectionHandler(cloud, dataService);
    const fogConnectionHandler = new FogConnectionHandler(fog, devicesService, dataService);
    const devicesPolling = new DevicesPolling(fog, cloud, devicesService);

    await devicesService.load();
    await cloudConnectionHandler.start();
    await fogConnectionHandler.start();
    await devicesPolling.start();
  } catch (err) {
    logger.error(err);
  }
}

main();
