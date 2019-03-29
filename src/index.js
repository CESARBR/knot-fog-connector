/* eslint-disable no-console */
// Infrastructure
import SettingsFactory from 'data/SettingsFactory';
import DeviceStore from 'data/DeviceStore';
import CloudConnectorFactory from 'network/CloudConnectorFactory';
import CloudConnectionHandler from 'network/CloudConnectionHandler';
import FogConnectorFactory from 'network/FogConnectorFactory';
import FogConnectionHandler from 'network/FogConnectionHandler';

// Domain
import UpdateDevices from 'interactors/UpdateDevices';
import LoadDevices from 'interactors/LoadDevices';
import UpdateChanges from 'interactors/UpdateChanges';
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
    let fog;
    const cloud = CloudConnectorFactory.create(settings.cloudType, settings.cloud);
    if (settings.fog.uuid && settings.fog.token) {
      fog = new FogConnectorFactory(settings.fog).create();
      await fog.connect();
      await cloud.start();
    } else {
      throw Error('Missing uuid and token');
    }

    if (process.env.NODE_ENV === 'production') {
      process.setgid(settings.runAs.group);
      process.setuid(settings.runAs.user);
    }

    const updateDevices = new UpdateDevices(deviceStore, fog, cloud);
    const loadDevices = new LoadDevices(deviceStore, cloud, fog);
    const updateChanges = new UpdateChanges(deviceStore, cloud);
    const devicesService = new DevicesService(updateDevices, loadDevices, updateChanges);
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

    await devicesService.load();
    await cloudConnectionHandler.start();
    await fogConnectionHandler.start();

    setInterval(devicesService.update.bind(devicesService), 5000);
  } catch (err) {
    logger.error(err);
  }
}

main();
