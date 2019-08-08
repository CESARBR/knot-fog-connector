class Settings {
  constructor(cloudType, cloud, runAs, rabbitMQ) {
    this.cloudType = cloudType;
    this.cloud = cloud;
    this.runAs = runAs;
    this.rabbitMQ = rabbitMQ;
  }
}

export default Settings;
