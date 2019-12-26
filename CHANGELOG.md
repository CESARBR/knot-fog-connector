# [4.0.0](https://github.com/CESARBR/knot-fog-connector/compare/v3.0.0...v4.0.0)

### Features

- Add AMQP connection manager.
- Add AMQP publisher to encapsulate specific fields.
- Add device in store after add in connector.
- Send error property in registered device.
- Add option to auto ack messages.
- Remove device in store after remove in connector.
- Send error property in list devices
- Send error property in unregistered device.
- Send error property in authenticated device.
- Add expiration time for each message.
- Re-enable FIWARE support.

### Bug Fixes

- Synchronize package-lock.json.
- Update dependency knot-cloud to v2.0.1.

### Improvements

- Add dependency install step to quick-start.
- Change environment setup JSON
- Change northbound exchange name.

# [3.0.0](https://github.com/CESARBR/knot-fog-connector/compare/v2.1.0...v3.0.0)

### Features

- Add device unregistered callback.
- Send updated schema message to queue.
- Send registered device message to queue.
- Add authenticate device.
- Add list devices command.
- Disable FIWARE support.

### Bug Fixes

- Adapt publish data to receive correct object.
- Fix mapping of request data payload.
- Print error message instead of error object.
- Update packages to fix vulnerabilities.
- Validate cloud type when loading configuration.

### Improvements

- Update README.
- Add CHANGELOG.md.
- Convert update data to snake_case.
- Convert devices schema to snake_case before send.
- Remove polling from the fog service.
- Verify if schema is valid when update devices.
- Verify if schema is available before publish data.
- Allow configuration via environment variables.
- Reduce restriction on cloud settings format.
- Add Docker container specification.

# [2.1.0](https://github.com/CESARBR/knot-fog-connector/compare/v2.0.2...v2.1.0)

### Features

- Handle connectivity issues.

## [2.0.2](https://github.com/CESARBR/knot-fog-connector/compare/v2.0.1...v2.0.2)

### Bug Fixes

- Fix vulnerability issues due to Meshblu's package.

## [2.0.1](https://github.com/CESARBR/knot-fog-connector/compare/v2.0.0...v2.0.1)

### Bug Fixes

- Fix broken polling.

# [2.0.0](https://github.com/CESARBR/knot-fog-connector/compare/v1.0.0...v2.0.0)

### Features

- Disable FIWARE support and deprecated KNoT Cloud ([CESARBR/knot-cloud-source](https://github.com/CESARBR/knot-cloud-source)).
- Support new KNoT Cloud (([CESARBR/knot-cloud-source](https://github.com/CESARBR/knot-cloud))).

# [1.0.0](https://github.com/CESARBR/knot-fog-connector/compare/a6e150c...v1.0.0)

### Features

- Support KNoT Cloud ([CESARBR/knot-cloud-source](https://github.com/CESARBR/knot-cloud-source)) and FIWARE.
