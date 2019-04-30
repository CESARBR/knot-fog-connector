import KnotCloudConnector from '@cesarbr/knot-fog-connector-knot-cloud';
import FiwareConnector from '@cesarbr/knot-fog-connector-fiware';

import logger from 'util/logger';

class CloudConnectorFactory {
  static create(type, settings) {
    switch (type) {
      case 'KNOT_CLOUD':
        logger.info('KNoT Cloud Connector selected');
        return new KnotCloudConnector(settings);
      case 'FIWARE':
        logger.info('Fiware connector selected');
        return new FiwareConnector(settings);
      default:
        throw Error('Unknown cloud');
    }
  }
}

export default CloudConnectorFactory;
