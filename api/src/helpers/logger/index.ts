import logger from './winston';
import { EventEmitter } from 'events';
import DatabaseError from '../error/DatabaseError';

const logEvent = new EventEmitter();

logEvent.on('error', (e: Error) => {
    logger.error({
        name: e.name, 
        message: e.message,
        stack: e.stack || '--no-stack-trace',
    });
});

logEvent.on('dbError', (data: DatabaseError) => {
    logger.error({
        name: data.error.name,
        message: data.error.message,
        stack: data.error.stack || '',
        ...data.params
    });
});

export default logEvent;