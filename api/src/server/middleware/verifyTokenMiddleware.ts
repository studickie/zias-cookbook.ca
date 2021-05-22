import { Request, Response, NextFunction } from 'express';
import { ErrorUnauthorized } from '../../helpers/error/ApplicationError';
import jwToken from '../../helpers/jwToken';

export default function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    const { authorization } = req.headers;

    if (!authorization) {
        return next(new ErrorUnauthorized('Invalid credentials'));
    }

    const decoded = jwToken.verify(authorization);

    if (!decoded) {
        return next(new ErrorUnauthorized('Invalid credentials'));
    }

    req.accountId = (decoded as {data: { account: string }}).data.account;

    return next();
}