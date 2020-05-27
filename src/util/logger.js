import config from 'config';
import winston from 'winston';
import winstonSyslog from 'winston-syslog';

winstonSyslog.Syslog; // eslint-disable-line no-unused-expressions

const useConsole = config.get('log.console'); // eslint-disable-line vars-on-top
const useSyslog = config.get('log.syslog'); // eslint-disable-line vars-on-top
const logLevel = config.get('log.level'); // eslint-disable-line vars-on-top

const transports = []; // eslint-disable-line vars-on-top

if (useSyslog) {
  transports.push(
    new winston.transports.Syslog({
      appName: 'knot-fog-connector',
      handleExceptions: true,
      level: logLevel,
      localhost: '',
      protocol: 'unix',
      path: '/dev/log',
      facility: 'daemon',
      format: winston.format.printf((info) => info.message),
    })
  );
}

if (useConsole) {
  transports.push(
    new winston.transports.Console({
      handleExceptions: true,
      level: logLevel,
      format: winston.format.simple(),
    })
  );
}

const logger = winston.createLogger({ transports }); // eslint-disable-line vars-on-top

export default logger;
