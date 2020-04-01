# KNoT Fog Connector Events API - v2.0.0

This document describes the events `knot-fog-connector` is able to receive and send. They are gruped based on the external clients point of view, i.e. publishing or subscribing to the topics. In each section, it is provided information about the header, payload and protocol binding details of the event.

## Content

- [Publish](#publish) (external clients can publish to):
  - [device.registered](#device-registered)
  - [device.unregistered](#device-unregistered)
  - [device.schema.updated](#device-schema-updated)
  - [data.published](#data-published)

- [Subscribe](#subscribe) (external clients can subscribe to):
  - [data.request](#data-request)
  - [data.update](#data-update)
----------------------------------------------------------------

## Publish

This section describes the events that this service can receive from the external applications.

### **device.registered** <a name="device-registered"></a>

Event that represents a thing was registered.

<details>
  <summary>Payload</summary>

  JSON in the following format:

  - `id` **String** thing's ID
  - `token` **String** thing's token
  - `error` **String** detailed error message

  Success example:

  ```json
  {
    "id": "fbe64efa6c7f717e",
    "token": "5b67ce6bef21701331152d6297e1bd2b22f91787",
    "error": null
  }
  ```

  Error example:

  ```json
  {
    "id": "3aa21010cda96fe9",
    "token": "",
    "error": "device already exists"
  }
  ```

</details>

<details>
  <summary>AMQP Binding</summary>

  - Exchange:
    - Type: direct
    - Name: device
    - Durable: `true`
    - Auto-delete: `false`
  - Routing key: device.registered

</details>

### **device.unregistered** <a name="device-unregistered"></a>

Event that represents a thing was removed.

<details>
  <summary>Payload</summary>

  JSON in the following format:

  - `id` **String** thing's ID
  - `error` **String** detailed error message

  Success example:

  ```json
  {
    "id": "fbe64efa6c7f717e",
    "error": null
  }
  ```

  Error example:

  ```json
  {
    "id": "3aa21010cda96fe9",
    "error": "forbidden",
  }
  ```
</details>

<details>
  <summary>AMQP Binding</summary>

  - Exchange:
    - Type: direct
    - Name: device
    - Durable: `true`
    - Auto-delete: `false`
  - Routing key: device.unregistered

</details>

### **device.schema.updated** <a name="device-schema-updated"></a>

Event that represents a thing's schema was updated.

<details>
  <summary>Payload</summary>

  JSON in the following format:

  - `id` **String** thing's ID
  - `error` **String** detailed error message

  Success example:

  ```json
  {
    "id": "fbe64efa6c7f717e",
    "error": null
  }
  ```

  Error example:

  ```json
  {
    "id": "3aa21010cda96fe9",
    "error": "invalid schema"
  }
  ```
</details>

<details>
  <summary>AMQP Binding</summary>

  - Exchange:
    - Type: direct
    - Name: device
    - Durable: `true`
    - Auto-delete: `false`
  - Routing key: device.schema.updated

</details>

### **data.published** <a name="data-published"></a>

Event that represents a data published from a thing's sensor.

<details>
  <summary>Payload</summary>

  JSON in the following format:

  - `id` **String** thing's ID
  - `data` **Array** data items to be published, each one formed by:
    - `sensorId` **Number** sensor ID
    - `value` **Number|Boolean|String** sensor value

  Example:

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
</details>

<details>
  <summary>AMQP Binding</summary>

  - Exchange:
    - Type: fanout
    - Name: data.published
    - Durable: `true`
    - Auto-delete: `false`

</details>

## Subscribe

The external consumer applications can subscribe to the events described in this section to receive them and take the appropriate action.

### **data.request** <a name="data-request"></a>

Event-command to request data from a thing's sensor. After receiving this event, [`babeltower`](https://github.com/CESARBR/knot-babeltower/) makes the necessary semantic validation and send a [`device.<id>.data.request`](#device-[id]-data-request) event to be routed to the service which control the thing.

<details>
  <summary>Headers</summary>

  - `token` **String** user's token

</details>

<details>
  <summary>Payload</summary>

  JSON in the following format:

  - `id` **String** thing's ID
  - `sensorIds` **Array (Number)** IDs of the sensor to send last value

  Example:

  ```json
  {
    "id": "fbe64efa6c7f717e",
    "data": [1]
  }
  ```
</details>

<details>
  <summary>AMQP Binding</summary>

  - Exchange:
    - Type: direct
    - Name: device
    - Durable: `true`
    - Auto-delete: `false`
  - Routing key: data.request

</details>

### **data.update** <a name="data-update"></a>

Event-command to update a thing's sensor data. After receiving this event, [`babeltower`](https://github.com/CESARBR/knot-babeltower/) makes the necessary semantic validation and send a [`device.<id>.data.update`](#device-[id]-data-update) event to be routed to the service which control the thing.

<details>
  <summary>Headers</summary>

  - `token` **String** user's token

</details>

<details>
  <summary>Payload</summary>

  JSON in the following format:

  - `id` **String** thing's ID
  - `data` **Array (Object)** updates for sensors/actuators, each one formed by:
    - `sensorId` **Number** ID of the sensor to update
    - `value` **Number|Boolean|String** data to be written

  Example:

  ```json
  {
    "id": "fbe64efa6c7f717e",
    "data": [{
        "sensorId": 1,
        "value": true
    }]
  }
  ```
</details>

<details>
  <summary>AMQP Binding</summary>

  - Exchange:
    - Type: direct
    - Name: device
    - Durable: `true`
    - Auto-delete: `false`
  - Routing key: data.update

</details>