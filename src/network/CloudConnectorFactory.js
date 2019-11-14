import KNoTCloudConnector from '@cesarbr/knot-fog-connector-knot-cloud';
import KNoTCloudAWSIoTConnector from 'knot-fog-connector-aws';

class CloudConnectorFactory {
  static create(type, settings) {
    const connectors = {
      KNOT_CLOUD: KNoTCloudConnector,
      KNOT_AWS_IOT: KNoTCloudAWSIoTConnector,
    };
    return new connectors[type](settings);
  }
}

export default CloudConnectorFactory;
