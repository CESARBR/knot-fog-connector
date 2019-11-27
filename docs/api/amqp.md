# AMQP API

This document specifies the messages expected by the connector through a publish/subscriber middleware that supports the AMPQ protocol. These messages can be listed in two main categories:

### Southbound traffic (commands, northbound commmands response):

- Update data
- Request data
- Devices list
- Device auth status
- Registered device
- Schema status
- Removed device

### Northbound traffic (control, measurements):

- Register thing
- Unregister thing
- Update thing's schema
- Publish thing's data
- List devices command
- Authenticate device command

## Message types (Southbound)

### Update data

Updates a thing's sensor value.

#### Exchange

* `fog`

#### Binding Key

* `data.update`

#### Data

JSON in the following format:
  * `id` **String** thing's ID
  * `data` **Array (Object)** updates for sensors/actuators, each one formed by:
    * `sensorId` **Number** ID of the sensor to update
    * `value` **Number|Boolean|String** data to be written

#### Example

```json
{
  "id": "fbe64efa6c7f717e",
  "data": [{
      "sensorId": 1,
      "value": true
  }]
}
```

### Request data

Request a thing's sensor value.

#### Exchange

* `fog`

#### Binding Key

* `data.request`

#### Data

JSON in the following format:
  * `id` **String** thing's ID
  * `sensorIds` **Array (Number)** IDs of the sensor to send last value

#### Example

```json
{
  "id": "fbe64efa6c7f717e",
  "data": [1]
}
```

### Devices list

Message with the list of devices registered on the cloud.

#### Exchange

* `fog`

#### Binding Key

* `device.list`

#### Expected Response

JSON in the following format:
  * `devices` **Array (Object)** devices representation

#### Success Response Example

```json
{
  "devices": [
    {
      "id": "3aa21010cda96fe9",
      "name": "KNoT Dongle",
      "schema": [
        {
          "sensor_id": 0,
          "value_type": 3,
          "unit": 0,
          "type_id": 65521,
          "name": "LED"
        }
      ]
    }
  ],
  "error": null,
}
```

#### Error Response Example

```json
{
  "devices": [],
  "error": "Connection refused"
}
```

### Device authentication status

Message with the status of device authentication command.

#### Exchange

* `fog`

#### Binding Key

* `device.auth`

#### Expected Response

JSON in the following format:
  * `id` **String** device's ID
  * `error` **String** a string with detailed error message.

#### Success Response Example

```json
{
  "id": "3aa21010cda96fe9",
  "error": null
}
```

#### Error Response Example

```json
{
  "id": "3aa21010cda96fe9",
  "error": "Unauthorized"
}
```
### Registered device

Message with the device credentials.

#### Exchange

* `fog`

#### Binding Key

* `device.registered`

#### Expected Response

JSON in the following format:
  * `device` **Object** device credentials
    * `id` **String** device ID
    * `token` **String** device token

#### Success Response Example

```json
{
  "id": "3aa21010cda96fe9",
  "token": "5b67ce6bef21701331152d6297e1bd2b22f91787",
  "error": null
}
```

#### Error Response Example

```json
{
  "id": "3aa21010cda96fe9",
  "token": "",
  "error": "Device already exists"
}
```

### Schema status

Message with the status of schema update command.

#### Exchange

* `fog`

#### Binding Key

* `schema.updated`

#### Expected Response

JSON in the following format:
  * `id` **String** device's ID
  * `error` **String** a string with detailed error message.

#### Success Response Example

```json
{
  "id": "3aa21010cda96fe9",
  "error": null
}
```

#### Error Response Example

```json
{
  "id": "3aa21010cda96fe9",
  "error": "- \"valueType\" must be larger than or equal to 1\n- \"name\" must be a string\n- \"value\" does not contain 1 required value(s)"
}
```

### Device removed

Message with the device unregistered on the cloud.

#### Exchange

* `fog`

#### Binding Key

* `device.unregistered`

#### Expected Response

JSON in the following format:
  * `id` **String** device ID
  * `error` **String** a string with detailed error message.

#### Success Response Example

```json
{
  "id": "3aa21010cda96fe9",
  "error": null,
}
```

#### Error Response Example

```json
{
  "id": "3aa21010cda96fe9",
  "error": "Forbidden",
}
```

## Message types (Northbound)

### Register thing

Registers a thing on the cloud and return its credentials through [`device.registered`](#registered-device) message.

#### Exchange

* `cloud`

#### Binding Key

* `device.register`

#### Data

JSON in the following format:
  * `id` **String** thing's ID
  * `name` **String** thing's name

#### Example

```json
{
  "id": "fbe64efa6c7f717e",
  "name": "KNoT Thing"
}
```

### Unregister thing

Unregisters a thing on the cloud.

#### Exchange

* `cloud`

#### Binding Key

* `device.unregister`

#### Data

JSON in the following format:
  * `id` **String** thing's ID

#### Example

```json
{
  "id": "fbe64efa6c7f717e"
}
```

### Update schema

Updates thing's schema on the cloud and returns the status through [`schema.updated`](#schema-status) message.

#### Exchange

* `cloud`

#### Binding Key

* `schema.update`

#### Data

JSON in the following format:
  * `id` **String** thing's ID
  * `schema` **Array** schema items, each one formed by:
    * `sensorId` **Number** sensor ID
    * `valueType` **Number** semantic value type (voltage, current, temperature, etc)
    * `unit` **Number** sensor unit (V, A, W, W, etc)
    * `typeId` **Number** data value type (boolean, integer, etc)
    * `name` **String** sensor name

#### Example

```json
{
  "id": "fbe64efa6c7f717e",
  "schema": [{
    "sensorId": 1,
    "valueType": 0xFFF1,
    "unit": 0,
    "typeId": 3,
    "name": "Door lock"
  }]
}
```

### Publish data

Publishes thing's data.

#### Exchange

* `cloud`

#### Binding Key

* `data.publish`

#### Data

JSON in the following format:
  * `id` **String** thing's ID
  * `data` **Array** data items to be published, each one formed by:
    * `sensorId` **Number** sensor ID
    * `value` **Number|Boolean|String** sensor value

#### Example

```json
{
  "id": "fbe64efa6c7f717e",
  "data": [
    {
      "sensorId": 1,
      "value": false
    },
    {
      "sensorId": 2,
      "value": 1000
    }
  ]
}
```

### List devices command

Receive a command to list the devices registered on cloud and return the data through [`device.list`](#devices-list) message.

#### Exchange

* `cloud`

#### Binding Key

* `device.cmd.list`

#### Data

JSON in the following format:
  * Empty object

#### Example

```json
{}
```

### Authenticate device command

Receive a command to authenticate the device on cloud and return the status through [`device.auth`](#device-authentication-status) message.

#### Exchange

* `cloud`

#### Binding Key

* `device.cmd.auth`

#### Data

JSON in the following format:
  * `id` **String** device's ID
  * `token` **String** device's token

#### Example

```json
{
  "id": "fbe64efa6c7f717e",
  "token": "0c20c12e2ac058d0513d81dc58e33b2f9ff8c83d"
}
```
