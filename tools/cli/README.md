# AMQP CLI

This CLI aims to ease the development process when sending messages to or from the connector through devices and data API.

### Run

You just need to run `node tools/cli` and see the supported commands on help menu.

### Example

```
cli <command>

Commands:
  cli publish-data <device-id> <sensor-id>  Publish <value> as a <sensor-id>
  <value>

Options:
  --version   Show version number                                      [boolean]
  --hostname  AMQP server hostname                        [default: "localhost"]
  --port      AMQP server port                                   [default: 5672]
  -h, --help  Show help                                                [boolean]
```

Publishing data to a device's sensor:

`node tools/cli publish-data b00712c829830501 1`