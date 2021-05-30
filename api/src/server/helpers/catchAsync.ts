import { Request, Response, NextFunction } from 'express';

/**
 * Catches promise rejections in Express.js routes and middleware
 * @param fn 
 */
function catchAsync(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): 
    (req: Request, res: Response, next: NextFunction) => Promise<unknown> {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {   
            return await fn(req, res, next);
        } catch (e) {
            // TODO: log request error as "warning" if is system-generated error; "error" otherwise
            return next(e);
        } finally {
            // TODO: log request as "debug" level while NODE_ENV === 'development'
        }
    };
}

export default catchAsync;