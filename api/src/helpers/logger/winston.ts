import path from 'path';
import { createLogger, format, transports } from 'winston';
const { combine, colorize, json, timestamp, printf, label } = format;

/*
*   Winston docs: npmjs.com/package/winston
*   ---------------------------------------
*   Logger config
*       -> digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications
*   Logform logger formatting:
*       -> github.com/winstonjs/logform
*/

const appRoot = process.env.NODE_PATH || path.resolve(__dirname, '../../');

const consoleFormat = printf(({ label, message, stack }) => {
    return `
    [${label}]: ${message}
    ${stack}
    `;
});

const options = {
    file: {
        level: 'error',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        format: combine(
            label({ label: 'ERROR'}),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            json()
        ),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    },
    console: {
        level: 'error',
        handleExceptions: false,
        format: combine(
            label({ label: 'ERROR'}),
            colorize({ colors: { error: 'red' } }),
            consoleFormat
        )
    }
}

const logger = createLogger({
    transports: [
        new transports.File(options.file)
    ]
});

if (process.env.NODE_ENV != 'production') {
    logger.add(new transports.Console(options.console));
}

export default logger;