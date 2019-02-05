class ConnectorFactory {
  static create(type, settings) { // eslint-disable-line no-unused-vars
    switch (type) {
      default:
        throw Error('Unknown cloud');
    }
  }
}

export default ConnectorFactory;
