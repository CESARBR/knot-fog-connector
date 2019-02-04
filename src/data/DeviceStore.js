import _ from 'lodash';

class DeviceStore {
  constructor() {
    this.loadDevices = [];
  }

  async add(device) {
    this.loadDevices.push(device);
  }

  async remove(device) {
    const index = this.loadDevices.indexOf(device);
    if (index > -1) {
      this.loadDevices.splice(index, 1);
    }
  }

  async update(id, diff) {
    const device = _.find(this.loadDevices, _device => _device.id === id);
    if (device) {
      _.merge(device, diff);
    }
  }

  async list() {
    return this.loadDevices;
  }
}

export default DeviceStore;
