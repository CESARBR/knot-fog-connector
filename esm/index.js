import Settings from 'data/Settings';
import ConnectorFactory from 'network/ConnectorFactory';
import FogConnector from 'network/FogConnector';

const settings = new Settings();

async function main() {
  const fogCredentials = await settings.getFogCredentials();
  const fogAddress = await settings.getFogAddress();
  const cloudSettings = await settings.getCloudSettings();
  const cloudType = await settings.getCloudType();

  try {
    const cloud = ConnectorFactory.create(cloudType, cloudSettings);
    if (fogCredentials.uuid && fogCredentials.token) {
      const fog = new FogConnector(
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
  } catch (err) {
    console.error(err);
  }
}

main();
