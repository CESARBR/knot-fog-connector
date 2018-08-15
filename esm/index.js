/* eslint-disable no-console */
// Infrastructure
import Settings from 'data/Settings';
import DeviceStore from 'data/DeviceStore';
import ConnectorFactory from 'network/ConnectorFactory';
import FogConnector from 'network/FogConnector';

// Domain
import UpdateDevices from 'interactors/UpdateDevices';
import LoadDevices from 'interactors/LoadDevices';
import UpdateChanges from 'interactors/UpdateChanges';
import DevicesService from 'services/DevicesService';
import UpdateData from 'interactors/UpdateData';
import UpdateConfig from 'interactors/UpdateConfig';
import UpdateProperties from 'interactors/UpdateProperties';
import RequestData from 'interactors/RequestData';
import DataService from 'services/DataService';
import PublishData from 'interactors/PublishData';

const settings = new Settings();
const deviceStore = new DeviceStore();

async function main() {
  const fogCredentials = await settings.getFogCredentials();
  const fogAddress = await settings.getFogAddress();
  const cloudSettings = await settings.getCloudSettings();
  const cloudType = await settings.getCloudType();

  try {
    let fog;
    const cloud = ConnectorFactory.create(cloudType, cloudSettings);
    if (fogCredentials.uuid && fogCredentials.token) {
      fog = new FogConnector(
        fogAddress.host,
        fogAddress.port,
        fogCredentials.uuid,
        fogCredentials.token,
      );

      await fog.connect();
      await cloud.start();
    } else {
      throw Error('Missing uuid and token');
    }

    const updateDevices = new UpdateDevices(deviceStore, fog, cloud);
    const loadDevices = new LoadDevices(deviceStore, cloud, fog);
    const updateChanges = new UpdateChanges(deviceStore, cloud);
    const devicesService = new DevicesService(updateDevices, loadDevices, updateChanges);
    const updateData = new UpdateData(fog);
    const updateConfig = new UpdateConfig(fog);
    const updateProperties = new UpdateProperties(fog);
    const publishData = new PublishData(cloud);
    const requestData = new RequestData(fog);
    const dataService = new DataService(
      updateData,
      updateConfig,
      updateProperties,
      requestData,
      publishData,
    );

    await devicesService.load();

    await cloud.onDataUpdated(async (id, sensorId, data) => {
      await dataService.update(id, sensorId, data);
    });

    await cloud.onConfigUpdated(async (id, config) => {
      await dataService.updateConfig(id, config);
    });

    await cloud.onPropertiesUpdated(async (id, properties) => {
      await dataService.updateProperties(id, properties);
    });

    await cloud.onDataRequested(async (id, sensorId) => {
      await dataService.request(id, sensorId);
    });

    await fog.on('config', async (device) => {
      try {
        await devicesService.updateChanges(device);
      } catch (err) {
        console.error(err);
      }
    });

    await fog.on('message', async (msg) => {
      try {
        await dataService.publish(msg.fromId, msg.payload);
      } catch (err) {
        console.error(err);
      }
    });

    setInterval(devicesService.update.bind(devicesService), 5000);
  } catch (err) {
    console.error(err);
  }
}

main();
