const path = require('path')
const winston = require('winston')
const { transports, format } = winston
const { combine, timestamp, printf } = format

const LOG_DIR = path.resolve(__dirname, '../logs')

function createLogger() {

    return winston.createLogger({
        transports: [
            new transports.Console(),
            new transports.File({ filename: path.join(LOG_DIR, 'combined.log') }),
            new transports.File({ filename: path.join(LOG_DIR, 'error.log'), level: 'error' }),
        ],
        format: combine(
            timestamp(),
            printf(({ level, timestamp, message }) => `[${timestamp}] [${level}] ${message}`),
        ),
    })
}

module.exports = {
    createLogger,
}
