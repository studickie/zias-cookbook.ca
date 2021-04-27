import { Request, Response, NextFunction } from 'express';
import jwToken from '../../helpers/jwToken';

export default function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    const { access_token } = req.body;

    if (!access_token) {
        return next(new Error('Unauthorized'));
    }

    const decoded = jwToken.verify(access_token);

    if (!decoded) {
        return next(new Error('Unauthorized'));
    }

    console.log('decoded token', decoded);

    return next();
}