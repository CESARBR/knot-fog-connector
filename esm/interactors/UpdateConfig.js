class UpdateConfig {
  constructor(fogConnector) {
    this.fogConnector = fogConnector;
  }

  async execute(id, config) {
    await this.fogConnector.updateConfig(id, config);
  }
}

export default UpdateConfig;
