import AMQPConnection from 'network/AMQPConnection';

class AMQPConnectionFactory {
  constructor(settings) {
    this.settings = settings;
  }

  create() {
    return new AMQPConnection(this.settings);
  }
}

export default AMQPConnectionFactory;
