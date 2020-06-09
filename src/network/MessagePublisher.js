const exchangeControl = 'control';
const deviceExchange = 'device';
const expirationTime = 10000;

class MessagePublisher {
  constructor(queue, token) {
    this.queue = queue;
    this.token = token;
  }

  async sendDataUpdate(body) {
    await this.queue.send(
      deviceExchange,
      'direct',
      'data.update',
      body,
      { Authorization: this.token },
      expirationTime
    );
  }

  async sendDataRequest(body) {
    await this.queue.send(
      deviceExchange,
      'direct',
      'data.request',
      body,
      { Authorization: this.token },
      expirationTime
    );
  }

  async sendDisconnected() {
    await this.queue.send(
      exchangeControl,
      'topic',
      'disconnected',
      {},
      { Authorization: this.token }
    );
  }

  async sendReconnected() {
    await this.queue.send(
      exchangeControl,
      'topic',
      'reconnected',
      {},
      { Authorization: this.token }
    );
  }
}

export default MessagePublisher;
