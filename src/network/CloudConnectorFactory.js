import KNoTCloudConnector from '@cesarbr/knot-fog-connector-knot-cloud';
import FiwareConnector from '@cesarbr/knot-fog-connector-fiware';

class CloudConnectorFactory {
  static create(type, settings) {
    const connectors = {
      KNOT_CLOUD: KNoTCloudConnector,
      FIWARE: FiwareConnector,
    };
    return new connectors[type](settings);
  }
}

export default CloudConnectorFactory;
