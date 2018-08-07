import Credentials from 'entities/Credentials';
import Address from 'entities/Address';
import config from 'config';

class Settings {
  async getFogCredentials() {
    return new Credentials(config.get('fog.uuid'), config.get('fog.token'));
  }

  async getFogAddress() {
    return new Address(config.get('fog.host'), config.get('fog.port'));
  }

  async getCloudSettings() {
    return config.get('cloud');
  }

  async getCloudType() {
    return config.get('cloudType');
  }
}

export default Settings;
