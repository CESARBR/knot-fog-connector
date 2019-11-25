import convertToSnakeCase from '../util/snakeCase';

class ListDevices {
  constructor(cloudConnector, publisher) {
    this.cloudConnector = cloudConnector;
    this.publisher = publisher;
  }

  async execute() {
    try {
      const devices = await this.cloudConnector.listDevices();
      await this.publisher.sendList({
        devices: devices.map((dev) => {
          const device = dev;
          device.schema = convertToSnakeCase(dev.schema);
          return device;
        }),
        error: null,
      });
    } catch (error) {
      await this.publisher.sendList({ devices: [], error: error.message });
    }
  }
}

export default ListDevices;
