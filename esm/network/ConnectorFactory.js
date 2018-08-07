import Connector from 'knot-fog-connector-fiware';

class ConnectorFactory {
  static create(type, settings) {
    switch (type) {
      case 'FIWARE':
        return new Connector(settings);
      default:
        throw Error('Unknown cloud');
    }
  }
}

export default ConnectorFactory;
