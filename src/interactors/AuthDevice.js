class AuthenticateDevice {
  constructor(cloud, publisher) {
    this.cloud = cloud;
    this.publisher = publisher;
  }

  async execute(id, token) {
    let error;

    try {
      const status = await this.cloud.authDevice(id, token);
      error = status ? null : 'Unauthorized';
    } catch (err) {
      error = err.message;
    }

    return this.publisher.sendAuthenticatedDevice({ id, error });
  }
}

export default AuthenticateDevice;
