import Settings from 'data/Settings';
import ConnectorFactory from 'network/ConnectorFactory';

const settings = new Settings();

async function main() {
  const fogCredentials = await settings.getFogCredentials();
  const fogAddress = await settings.getFogAddress();
  const cloudSettings = await settings.getCloudSettings();
  const cloudType = await settings.getCloudType();

  try {
    const cloud = ConnectorFactory.create(cloudType, cloudSettings);
  } catch (err) {
    console.error(err);
  }
}

main();
