import { Request, Response, NextFunction } from 'express';
import ApplicationError from '../../helpers/error/ApplicationError';

export default function errorMiddleware(
    error: ApplicationError,
    req: Request,
    res: Response,
    next: NextFunction
): Response<unknown> {
    
    return res.status(error.statusCode || 500).json({
        name: error.name,
        message: error.message
    });
}