const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const config = require('../config');

const myFormat = printf(({ level, message, timestamp, metadata }) => {
  return JSON.stringify({
    timestamp,
    level,
    message,
    app: config.app,
    metadata: {
      ...metadata,
    }
  });
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console()
  ]
});

module.exports = {
  info: (message, metadata) => logger.info(message, metadata),
  debug: (message, metadata) => logger.debug(message, metadata),
  warn: (message, metadata) => logger.warn(message, metadata),
  error: (message, metadata) => logger.error(message, metadata)
};
