const {createLogger, format, transports} = require('winston');
const {combine, timestamp, colorize, printf} = format;

// Winston Format
const infoFormat = combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), colorize(), printf(({level, message, timestamp}) => `[${timestamp}] [${level}] ${message}`));
const errorFormat = combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), colorize({all: true}), printf(({level, message, timestamp}) => `[${timestamp}] [${level}] ${message}`));

// Create Logger
module.exports = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: infoFormat
        }, {
            level: 'error',
            format: errorFormat
        })
    ],
    exitOnError: false
});
