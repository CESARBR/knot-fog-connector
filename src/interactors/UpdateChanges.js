import _ from 'lodash';

import difference from 'util/difference';
import convertToCamelCase from 'util/camelCase';

class UpdateChanges {
  constructor(deviceStore, cloudConnector) {
    this.cloudConnector = cloudConnector;
    this.deviceStore = deviceStore;
  }

  async execute(device) {
    const localDevices = await this.deviceStore.list();
    if (!device) {
      return;
    }

    const localDevice = _.find(localDevices, { id: device.id });

    let diff = difference(device, localDevice);
    if (_.isEmpty(diff)) {
      return;
    }

    if (device.schema && device.schema.length > 0) {
      await this.cloudConnector.updateSchema(device.id, convertToCamelCase(device.schema));
      await this.deviceStore.update(device.id, diff);
    }

    diff = _.omit(diff, ['schema']);
    if (_.isEmpty(diff)) {
      return;
    }

    await this.deviceStore.update(device.id, diff);
  }
}

export default UpdateChanges;
