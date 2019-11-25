class AuthenticateDevice {
  constructor(cloud, queue) {
    this.cloud = cloud;
    this.queue = queue;
  }

  async execute(id, token) {
    const status = await this.cloud.authDevice(id, token);
    return this.queue.sendAuthenticatedDevice({ id, authenticated: status });
  }
}

export default AuthenticateDevice;
