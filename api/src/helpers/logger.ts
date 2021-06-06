import path from 'path';
import { createLogger, format, transports } from 'winston';
//const { combine, colorize, json, timestamp, printf, label } = format;

/*
*   Winston docs: npmjs.com/package/winston
*   ---------------------------------------
*   Logger config
*       -> digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications
*   Logform logger formatting:
*       -> github.com/winstonjs/logform
*/

const appRoot = process.env.NODE_PATH || '';

/*
    Log levels
    { 
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    }
*/

const logger = createLogger({
    transports: [
        new transports.File({
            filename: path.join(appRoot, 'logs/error.log'),
            level: 'error',
            format: format.json()
        }),
        new transports.File({
            filename: path.join(appRoot, 'logs/debug.log'),
            level: 'debug',
            format: format.json()
        })
    ]
});

// if (process.env.NODE_ENV != 'production') {
//     logger.add(new transports.Console(options.console));
// }

export default logger;