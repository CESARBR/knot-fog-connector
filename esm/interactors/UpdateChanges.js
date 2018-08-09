import _ from 'lodash';

class UpdateChanges {
  constructor(deviceStore, cloudConnector) {
    this.cloudConnector = cloudConnector;
    this.deviceStore = deviceStore;
  }

  async difference(object, base) { // https://gist.github.com/Yimiprod/7ee176597fef230d1451
    function changes(_object, _base) {
      return _.transform(_object, (result, value, key) => {
        if (!_.isEqual(value, _base[key])) {
          result[key] = (_.isObject(value) && _.isObject(_base[key])) ? changes(value, _base[key]) : value; // eslint-disable-line no-param-reassign, max-len
        }
      });
    }
    return changes(object, base);
  }

  async execute(device) {
    const localDevices = await this.deviceStore.list();
    if (!device) {
      return;
    }
    const localDevice = _.find(localDevices, { id: device.id });
    let diff = await this.difference(device, localDevice);

    if (_.isEmpty(diff)) {
      return;
    }

    if (device.schema && device.schema.length > 0) {
      await this.cloudConnector.updateSchema(device.id, device.schema);
      await this.deviceStore.update(device.id, diff);
    }

    diff = _.omit(diff, ['schema']);
    if (_.isEmpty(diff)) {
      return;
    }
    await this.cloudConnector.updateProperties(diff);
    await this.deviceStore.update(device.id, diff);
  }
}

export default UpdateChanges;
