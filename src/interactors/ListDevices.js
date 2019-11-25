import convertToSnakeCase from '../util/snakeCase';

class ListDevices {
  constructor(cloudConnector, queue) {
    this.cloudConnector = cloudConnector;
    this.queue = queue;
  }

  async execute() {
    const devices = await this.cloudConnector.listDevices();
    await this.queue.sendList(devices.map((dev) => {
      const device = dev;
      device.schema = convertToSnakeCase(dev.schema);
      return device;
    }));
  }
}

export default ListDevices;
