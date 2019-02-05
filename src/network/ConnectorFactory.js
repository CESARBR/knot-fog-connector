import KnotCloudConnector from '@cesarbr/knot-fog-connector-knot-cloud';
import logger from 'util/logger';

class ConnectorFactory {
  static create(type, settings) { // eslint-disable-line no-unused-vars
    switch (type) {
      case 'KNOT_CLOUD':
        logger.debug('KNoT Cloud Connector selected');
        return new KnotCloudConnector(settings);
      default:
        throw Error('Unknown cloud');
    }
  }
}

export default ConnectorFactory;
