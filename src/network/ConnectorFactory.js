import FiwareConnector from '@cesarbr/knot-fog-connector-fiware';
import KnotCloudConnector from '@cesarbr/knot-fog-connector-knot-cloud';
import logger from 'util/logger';

class ConnectorFactory {
  static create(type, settings) {
    switch (type) {
      case 'FIWARE':
        logger.debug('Fiware connector selected');
        return new FiwareConnector(settings);
      case 'KNOTCLOUD':
        logger.debug('KNoT Cloud Connector selected');
        return new KnotCloudConnector(settings);
      default:
        throw Error('Unknown cloud');
    }
  }
}

export default ConnectorFactory;
