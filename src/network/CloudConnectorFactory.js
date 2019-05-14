import KNoTCloudConnector from '@cesarbr/knot-fog-connector-knot-cloud';

class CloudConnectorFactory {
  static create(type, settings) {
    const connectors = {
      KNOT_CLOUD: KNoTCloudConnector,
    };
    return new connectors[type](settings);
  }
}

export default CloudConnectorFactory;
