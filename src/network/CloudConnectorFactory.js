import KNoTCloudConnector from '@cesarbr/knot-fog-connector-knot-cloud';
import MindsphereCloudConnector from '@isitics/knot-fog-connector-mindsphere';

class CloudConnectorFactory {
  static create(type, settings) {
    const connectors = {
      KNOT_CLOUD: KNoTCloudConnector,
      MINDSPHERE_CLOUD: MindsphereCloudConnector,
    };
    return new connectors[type](settings);
  }
}

export default CloudConnectorFactory;
