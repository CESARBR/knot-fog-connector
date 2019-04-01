class Settings {
  constructor(fog, cloudType, cloud, runAs, rabbitMQ) {
    this.fog = fog;
    this.cloudType = cloudType;
    this.cloud = cloud;
    this.runAs = runAs;
    this.rabbitMQ = rabbitMQ;
  }
}

export default Settings;
