import meshblu from 'meshblu';
import request from 'request';
import isBase64 from 'is-base64';
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

async function getDeviceUuid(connection, id) {
  const devices = await getMyDevices(connection);
  const device = devices.find(d => d.id === id);
  if (!device) {
    throw new Error('Not found');
  }
  return device.uuid;
}

function parseValue(value) {
  if (isNaN(value)) { // eslint-disable-line no-restricted-globals
    if (value === 'true' || value === 'false') {
      return (value === 'true');
    }
    if (!isBase64(value)) {
      throw new Error('Supported types are boolean, number or Base64 strings');
    }
    return value;
  }

  return parseFloat(value);
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

  async setData(id, sensorId, value) {
    const parsedValue = parseValue(value); // throws if value is invalid
    const uuid = await getDeviceUuid(this.connection, id);
    return new Promise((resolve) => {
      this.connection.update({
        uuid,
        set_data: [{
          sensor_id: sensorId,
          value: parsedValue,
        }],
      }, () => {
        resolve();
      });
    });
  }

  async updateConfig(id, config) {
    const uuid = await getDeviceUuid(this.connection, id);
    return new Promise((resolve) => {
      this.connection.update({
        uuid,
        config,
      }, () => {
        resolve();
      });
    });
  }


  async updateProperties(id, properties) {
    const uuid = await getDeviceUuid(this.connection, id);
    const query = properties;
    query.uuid = uuid;
    return new Promise((resolve) => {
      this.connection.update(query, () => {
        resolve();
      });
    });
  }


  async requestData(id, sensorId) {
    const uuid = await getDeviceUuid(this.connection, id);
    return new Promise((resolve) => {
      this.connection.update({
        uuid,
        get_data: [{ sensor_id: sensorId }],
      }, () => {
        resolve();
      });
    });
  }

  async publishData(id, data) {
    const uuid = await getDeviceUuid(this.connection, id);
    const postOptions = {
      url: `http://${this.hostname}:${this.port}/data/${uuid}`,
      method: 'POST',
      headers: {
        meshblu_auth_uuid: this.uuid,
        meshblu_auth_token: this.token,
        'Content-Type': 'application/json',
      },
      form: data,
    };

    return new Promise((resolve) => {
      request(postOptions, (err) => {
        if (err) {
          console.error(err);
        }
        resolve();
      });
    });
  }

  async subscribe(id, type) {
    const uuid = await getDeviceUuid(this.connection, id);
    return new Promise((resolve, reject) => {
      this.connection.subscribe({
        uuid,
        type: [type],
      }, (result) => {
        if (result.error) {
          reject(result.error);
        } else {
          resolve();
        }
      });
    });
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
