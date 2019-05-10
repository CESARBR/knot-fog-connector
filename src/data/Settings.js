class Settings {
  constructor(fog, cloud, runAs, rabbitMQ) {
    this.fog = fog;
    this.cloud = cloud;
    this.runAs = runAs;
    this.rabbitMQ = rabbitMQ;
  }
}

export default Settings;
