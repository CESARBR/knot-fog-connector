import FiwareConnector from 'knot-fog-connector-fiware';
import MeshbluConnector from 'knot-fog-connector-meshblu';
import logger from 'util/logger';

class ConnectorFactory {
  static create(type, settings) {
    switch (type) {
      case 'FIWARE':
        logger.debug('Fiware connector selected');
        return new FiwareConnector(settings);
      case 'MESHBLU':
        logger.debug('Meshblu connector selected');
        return new MeshbluConnector(settings);
      default:
        throw Error('Unknown cloud');
    }
  }
}

export default ConnectorFactory;
