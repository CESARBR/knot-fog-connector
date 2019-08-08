import meshblu from '@cesarbr/meshblu';
import _ from 'lodash';

function createConnection(hostname, port, uuid, token) {
  return meshblu.createConnection({
    server: hostname,
    port,
    uuid,
    token,
  });
}

function connect(hostname, port, uuid, token) {
  return new Promise((resolve, reject) => {
    const connection = createConnection(hostname, port, uuid, token);

    connection.on('ready', () => {
      resolve(connection);
    });

    connection.on('notReady', () => {
      connection.close(() => {});
      reject(new Error('Connection not authorized'));
    });
  });
}

function mapDevice(device) {
  return _.omit(device, ['uuid', '_id', 'owner', 'type', 'ipAddress', 'token', 'meshblu', 'discoverWhitelist', 'configureWhitelist', 'socketid', 'secure']);
}

function getMyDevices(connection, uuid) {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('Not connected'));
      return;
    }

    connection.devices({ owner: uuid }, (result) => {
      if (result.error) {
        if (result.error.code === 404) {
          return resolve([]);
        }
        return reject(result.error);
      }

      return resolve(result);
    });
  });
}

class FogConnection {
  constructor(hostname, port, uuid, token) {
    this.hostname = hostname;
    this.port = port;
    this.uuid = uuid;
    this.token = token;
  }

  async connect() {
    if (this.connection) {
      return;
    }

    this.connection = await connect(this.hostname, this.port, this.uuid, this.token);
  }

  async close() {
    return new Promise((resolve) => {
      if (!this.connection) {
        resolve();
        return;
      }

      this.connection.close(() => {
        this.connection = null;
        resolve();
      });
    });
  }

  async getMyDevices() {
    const devices = await getMyDevices(this.connection, this.uuid);
    return devices.map(mapDevice);
  }

  async getDevice(id) {
    const devices = await this.getMyDevices();
    const device = devices.find(d => d.id === id);
    if (!device) {
      throw new Error('Not found');
    }
    return device;
  }

  on(event, callback) {
    if (!this.connection) {
      throw new Error('Not connected');
    }

    if (event === 'config') {
      this.connection.on(event, (device) => {
        if (_.has(device, 'id')) { // Just device with KNoT id can call an event
          const deviceMapped = mapDevice(device);
          callback(deviceMapped);
        }
      });
    } else if (event === 'message') {
      this.connection.on(event, async (msg) => {
        const devices = await getMyDevices(this.connection, this.uuid);
        const deviceFound = _.find(devices, dev => dev.uuid === msg.fromUuid);

        _.set(msg, 'fromId', deviceFound.id);
        callback(_.pick(msg, ['payload', 'fromId']));
      });
    }
  }
}

export default FogConnection;
