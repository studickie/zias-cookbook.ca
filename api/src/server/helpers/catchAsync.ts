import { Request, Response, NextFunction } from 'express';
import logger from '../../logger/winston';

/**
 * Catches promise rejections in Express.js routes and middleware
 * @param fn 
 */
function catchAsync(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>):
    (req: Request, res: Response, next: NextFunction) => Promise<unknown> {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await fn(req, res, next);

        } catch (err) {
            logger.error({
                method: req.method,
                path: req.path,
                name: err.name,
                message: err.message,
                trace: err.stack,
            });

            return next(err);

        }
    };
}

export default catchAsync;