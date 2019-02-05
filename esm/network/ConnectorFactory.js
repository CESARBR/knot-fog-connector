import FiwareConnector from '@cesarbr/knot-fog-connector-fiware';
import logger from 'util/logger';

class ConnectorFactory {
  static create(type, settings) {
    switch (type) {
      case 'FIWARE':
        logger.debug('Fiware connector selected');
        return new FiwareConnector(settings);
      default:
        throw Error('Unknown cloud');
    }
  }
}

export default ConnectorFactory;
