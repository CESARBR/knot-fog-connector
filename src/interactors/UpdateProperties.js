class UpdateProperties {
  constructor(fogConnector) {
    this.fogConnector = fogConnector;
  }

  async execute(id, properties) {
    await this.fogConnector.updateProperties(id, properties);
  }
}

export default UpdateProperties;
