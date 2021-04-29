import { Request, Response, NextFunction } from 'express';
import jwToken from '../../helpers/jwToken';

export default function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    const { authorization } = req.headers;

    if (!authorization) {
        return next(new Error('Unauthorized'));
    }

    const decoded = jwToken.verify(authorization);

    if (!decoded) {
        return next(new Error('Unauthorized'));
    }

    req.accountId = (decoded as {data: { account: string }}).data.account;

    return next();
}