# KNoT Fog connector service

This is a KNoT gateway service that connects the fog with a cloud service.

## Supported services

* [KNoT Cloud](https://github.com/CESARBR/knot-fog-connector-knot-cloud) (under development)

### Supported only in previous versions

* [FIWARE](https://github.com/CESARBR/knot-fog-connector-fiware)

## Quickstart

1. Build: `npm run build`
1. Start: `npm start`

## Creating a connector

A connector is as a library that exports by default the `Connector` class. This service will use the library as follows:

```javascript
import CustomCloudConnector from '@cesarbr/knot-fog-connector-customcloud';

...
const connector = new CustomCloudConnector(config);
await connector.start();
```

### Methods

#### constructor(config)

Create the connector using a configuration object that will be loaded from a JSON file and passed directly to this constructor. No work, such as connecting to a service, must be done in this constructor.

##### Argument

* `config` **Object** configuration parameters defined by the connector

##### Example

```javascript
import CustomCloudConnector from '@cesarbr/knot-fog-connector-customcloud';

const connector = new CustomCloudConnector({
  hostname: 'localhost',
  port: 3000,
  protocol: 'ws',
  ...
});
```

#### start(): Promise&lt;Void&gt;

Start the connector. This is the method where initialization procedures, such as connecting to external services, must be done.

##### Example

```javascript
import CustomCloudConnector from '@cesarbr/knot-fog-connector-customcloud';

const connector = new CustomCloudConnector({ ... });
await connector.start();
```

#### addDevice(device): Promise&lt;Void&gt;

Add a device to the cloud. Called when a new device is added to the fog.

##### Argument

* `device` **Object** device specification containing the following properties:
  * `id` **String** device ID (KNoT ID)
  * `name` **String** device name

##### Example

```javascript
await connector.start();
await connector.addDevice({
  id: '656123c6-5666-4a5c-9e8e-e2b611a2e66b',
  name: 'Front door'
});
```

#### removeDevice(id): Promise&lt;Void&gt;

Remove a device from the cloud. Called when a device is removed from the fog.

##### Argument

* `id` **String** device ID (KNoT ID)

##### Example

```javascript
await connector.start();
await connector.removeDevice('656123c6-5666-4a5c-9e8e-e2b611a2e66b');
```

#### listDevices(): Promise&lt;Object&gt;

List the devices registered on the cloud for the current gateway.

##### Result

* `devices` **Array** devices registered on the cloud or an empty array. Each device is an object as described in [`addDevice()`](#adddevicedevice-promisevoid)

##### Example

```javascript
await connector.start();
const devices = await connector.listDevices();
console.log(devices);
// [ { id: '656123c6-5666-4a5c-9e8e-e2b611a2e66b', name: 'Front door' },
//   { id: '254d62a9-2118-4229-8b07-5084c4cc3db6', name: 'Back door' } ]
```

#### publishData(id, data): Promise&lt;Void&gt;

Publish data as a device. Called when a device publishes data on the fog.

##### Argument

* `id` **String** device ID (KNoT ID)
* `data` **Array** data items to be published, each one formed by:
  * `sensorId` **Number** sensor ID
  * `value` **Number|Boolean|String** sensor value

##### Example

```javascript
await connector.start();
await connector.publishData('656123c6-5666-4a5c-9e8e-e2b611a2e66b', [
  {
    sensorId: 1,
    value: false
  },
  {
    sensorId: 2,
    value: 1000,
  }
]);
```

#### updateSchema(id, schema): Promise&lt;Void&gt;

Update the device schema. Called when a device updates its schema on the fog.

##### Argument

* `id` **String** device ID (KNoT ID)
* `schema` **Array** schema items, each one formed by:
  * `sensorId` **Number** sensor ID
  * `valueType` **Number** semantic value type (voltage, current, temperature, etc)
  * `unit` **Number** sensor unit (V, A, W, W, etc)
  * `typeId` **Number** data value type (boolean, integer, etc)
  * `name` **String** sensor name

Refer to the [protocol](https://github.com/CESARBR/knot-protocol-source) for more information on the possible values for each field.

**NOTE**: `schema` will always contain the whole schema and not a difference from a last update.

##### Example

```javascript
await connector.start();
await connector.updateSchema('656123c6-5666-4a5c-9e8e-e2b611a2e66b', [
  {
    sensorId: 1,
    valueType: 0xFFF1, // Switch
    unit: 0, // NA
    typeId: 3, // Boolean
    name: 'Door lock',
  },
  {
    sensorId: 2,
    ...
  }
]);
```

#### updateConfig(id, config): Promise&lt;Void&gt;

Update the device configuration. Called when a device updates its configuration on the fog.

##### Argument

* `id` **String** device ID (KNoT ID)
* `config` **Array** configuration for each sensor, each one formed by:
    * `sensorId` **Number** sensor ID
    * `eventFlags` **Number** event flags
    * `timeSec` **Number** update interval in seconds
    * `lowerLimit` **Number** (Optional) lower limit
    * `upperLimit` **Number** (Optional) upper limit

**NOTE**: `config` will always contain the whole configuration and not a difference from a last update.

##### Example

```javascript
await connector.start();
await connector.updateConfig('656123c6-5666-4a5c-9e8e-e2b611a2e66b', [
  {
    sensorId: 1,
    eventFlags: 0,
    timeSec: 100
  },
  {
    sensorId: 2,
    ...
  }
]);
```

#### onConfigRequested(cb): Promise&lt;Void&gt;

Register a callback to handle configuration requests from the cloud. Called when a cloud application requests the device to update its current configuration.

##### Argument

* `cb` **Function** event handler defined as `cb(id, sensorId)` where:
  * `id` **Number** device ID (KNoT ID)

##### Example

```javascript
await connector.start();
await connector.onConfigRequested((id) => {
  console.log(`Device '${id}' configuration is being requested`);
  // Device '1' configuration is being requested
});
```

#### onConfigUpdated(cb): Promise&lt;Void&gt;

Register a callback to handle configuration updates on the cloud. Called when a cloud application requests to update the device configuration.

##### Argument

* `cb` **Function** event handler defined as `cb(id, config)` where:
  * `id` **String** device ID (KNoT ID)
  * `config` **Array** configuration for each sensor, each one formed by:
    * `sensorId` **Number** sensor ID
    * `eventFlags` **Number** event flags
    * `timeSec` **Number** update interval in seconds
    * `lowerLimit` **Number** (Optional) lower limit
    * `upperLimit` **Number** (Optional) upper limit

**NOTE**: `config` might contain only the configuration for a subset of the sensors/actuators.

##### Example

```javascript
await connector.start();
await connector.onConfigUpdated((id, config) => {
  console.log(`Configuration for device '${id}' was updated`);
  console.log(config);
  // Configuration for device '656123c6-5666-4a5c-9e8e-e2b611a2e66b' was updated
  // [{
  //   sensorId: 1,
  //   eventFlags: 0,
  //   timeSec: 100 
  // }]
});
```

#### onDataRequested(cb): Promise&lt;Void&gt;

Register a callback to handle data requests from the cloud. Called when a cloud application requests the last value of a device's sensor.

##### Argument

* `cb` **Function** event handler defined as `cb(id, sensorId)` where:
  * `id` **Number** device ID (KNoT ID)
  * `sensorId` **String** ID of the sensor to send updated data

##### Example

```javascript
await connector.start();
await connector.onDataRequested((id, sensorId) => {
  console.log(`New data from '${sensorId}' on device '${id}' is being requested`);
  // New data from '1' on device '656123c6-5666-4a5c-9e8e-e2b611a2e66b' is being requested
});
```

#### onDataUpdated(cb): Promise&lt;Void&gt;

Register a callback to handle data updates from the cloud. Called when a cloud application requests to update a device's actuator.

##### Argument

* `cb` **Function** event handler defined as `cb(id, sensorId, data)` where:
  * `id` **Number** device ID (KNoT ID)
  * `sensorId` **String** ID of the sensor to update
  * `data` **Number|Boolean|String** data to be written

##### Example

```javascript
await connector.start();
await connector.onDataUpdated((id, sensorId, data) => {
  console.log(`Update actuator '${sensorId}' on device '${id}' to ${data}`);
  // Update actuator '2' on device '656123c6-5666-4a5c-9e8e-e2b611a2e66b' to 1000
});
```
