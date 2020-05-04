const exchangeControl = 'control';
const dataExchange = 'data';
const expirationTime = 10000;

class MessagePublisher {
  constructor(queue, token) {
    this.queue = queue;
    this.token = token;
  }

  async sendDataUpdate(body) {
    await this.queue.send(dataExchange, 'direct', 'data.update', body, { Authorization: this.token }, expirationTime);
  }

  async sendDataRequest(body) {
    await this.queue.send(dataExchange, 'direct', 'data.request', body, { Authorization: this.token }, expirationTime);
  }

  async sendDisconnected() {
    await this.queue.send(exchangeControl, 'topic', 'disconnected', {}, { Authorization: this.token });
  }

  async sendReconnected() {
    await this.queue.send(exchangeControl, 'topic', 'reconnected', {}, { Authorization: this.token });
  }
}

export default MessagePublisher;
