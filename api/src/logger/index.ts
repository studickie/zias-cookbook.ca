import logger from './winston';
import { EventEmitter } from 'events';

const logEvent = new EventEmitter();

logEvent.on('error', (e: Error) => {
    logger.error({
        name: e.name, 
        message: e.message,
        stack: e.stack || '--no-stack-trace',
    });
});

export default logEvent;