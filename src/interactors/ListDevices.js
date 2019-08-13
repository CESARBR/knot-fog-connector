class ListDevices {
  constructor(cloudConnector, queue) {
    this.cloudConnector = cloudConnector;
    this.queue = queue;
  }

  async execute() {
    const devices = await this.cloudConnector.listDevices();
    await this.queue.send('fog', 'device.list', devices);
  }
}

export default ListDevices;
