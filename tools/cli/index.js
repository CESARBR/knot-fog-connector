#!/usr/bin/env node
/* eslint-disable no-console */

require('yargs') // eslint-disable-line no-unused-expressions
  .option('hostname', {
    describe: 'AMQP server hostname',
    demandOption: false,
    default: 'localhost',
  })
  .option('port', {
    describe: 'AMQP server port',
    demandOption: false,
    default: 5672,
  })
  .commandDir('cmds')
  .demandCommand()
  .strict()
  .alias('h', 'help')
  .help()
  .argv;
