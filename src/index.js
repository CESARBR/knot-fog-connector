/* eslint-disable no-console */
// Infrastructure
import SettingsFactory from 'data/SettingsFactory';
import DeviceStore from 'data/DeviceStore';
import CloudConnectorFactory from 'network/CloudConnectorFactory';
import CloudConnectionHandler from 'network/CloudConnectionHandler';
import FogConnector from 'network/FogConnector';

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
      fog = new FogConnector(
        settings.fog.hostname,
        settings.fog.port,
        settings.fog.uuid,
        settings.fog.token,
      );

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

    await devicesService.load();
    await cloudConnectionHandler.start();

    await fog.on('config', async (device) => {
      try {
        logger.debug('Receive fog changes');
        logger.debug(`Device ${device.id} has changed`);
        await devicesService.updateChanges(device);
      } catch (err) {
        logger.error(err);
      }
    });

    await fog.on('message', async (msg) => {
      try {
        logger.debug(`Receive fog message from ${msg.fromId}`);
        logger.debug(`Payload message: ${msg.payload}`);
        await dataService.publish(msg.fromId, msg.payload);
      } catch (err) {
        logger.error(err);
      }
    });

    setInterval(devicesService.update.bind(devicesService), 5000);
  } catch (err) {
    logger.error(err);
  }
}

main();
