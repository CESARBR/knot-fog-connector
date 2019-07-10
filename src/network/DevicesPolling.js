import Joi from 'joi';
import _ from 'lodash';
import difference from 'util/difference';
import convertToCamelCase from 'util/camelCase';

function comparator(elem1, elem2) {
  if (elem1.id !== elem2.id) {
    return false;
  }

  const diff = difference(elem1, elem2);
  return !(diff.schema && diff.schema.length > 0);
}

function convertSchemaToCamelCase(value) {
  const device = value;
  device.schema = convertToCamelCase(device.schema);
  return device;
}

const deviceSchema = Joi.array().items(Joi.object().keys({
  sensorId: Joi.number().required(),
  valueType: Joi.number().required(),
  unit: Joi.number().required(),
  typeId: Joi.number().required(),
  name: Joi.string().required(),
}));

class DevicesPolling {
  constructor(fogConnector, cloudConnector, queue) {
    this.fogConnector = fogConnector;
    this.cloudConnector = cloudConnector;
    this.queue = queue;
  }

  async start() {
    setInterval(this.syncDevices.bind(this), 5000);
  }

  async syncDevices() {
    const cloudDevices = await this.cloudConnector.listDevices();
    const fogDevices = await this.fogConnector.getMyDevices();
    _.mapValues(fogDevices, value => convertSchemaToCamelCase(value));

    await this.updateDevicesAdded(cloudDevices, fogDevices);
    await this.updateDevicesRemoved(cloudDevices, fogDevices);
    await this.updateDevicesSchema(cloudDevices, fogDevices);
  }

  async updateDevicesAdded(cloudDevices, fogDevices) {
    const devices = _.differenceBy(fogDevices, cloudDevices, 'id');
    return Promise.all(devices.map(async (device) => {
      await this.queue.send('cloud', 'device.register', device);
    }));
  }

  async updateDevicesRemoved(cloudDevices, fogDevices) {
    const devices = _.differenceBy(cloudDevices, fogDevices, 'id');
    return Promise.all(devices.map(async (device) => {
      await this.queue.send('cloud', 'device.unregister', device);
    }));
  }

  async updateDevicesSchema(cloudDevices, fogDevices) {
    const devices = _.differenceWith(fogDevices, cloudDevices, comparator);
    return Promise.all(devices.map(async (device) => {
      try{
        this.validate('device.Schema',device.schema,deviceSchema);
        await this.queue.send('cloud', 'schema.update', device);
      }
      catch(err){
      }
    }));
  }

  validate(propertyName, propertyValue, schema) {
    const { error } = Joi.validate(propertyValue, schema, { abortEarly: false });
    if (error) {
      throw this.mapJoiError(propertyName, error);
    }
  }

  mapJoiError(propertyName, error) {
    const reasons = _.map(error.details, 'message');
    const formattedReasons = reasons.length > 1
      ? `\n${_.chain(reasons).map(reason => `- ${reason}`).join('\n').value()}`
      : reasons[0];
    return new Error(`Invalid "${propertyName}" property: ${formattedReasons}`);
  }

}

export default DevicesPolling;
