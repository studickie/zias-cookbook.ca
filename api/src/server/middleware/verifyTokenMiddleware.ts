import { Request, Response, NextFunction } from 'express';
import { ErrorUnauthorized } from '../../helpers/ApplicationError';
import jwToken from '../../helpers/jwToken';

export default function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    const { authorization } = req.headers;

    if (!authorization) {
        return next(new ErrorUnauthorized('Invalid credentials'));
    }
    
    const token = authorization.split(' ')[1];
    const decoded = jwToken.verify(token);

    if (!decoded) {
        return next(new ErrorUnauthorized('Invalid credentials'));
    }

    req.accountId = (decoded as {data: { account: string }}).data.account;

    return next();
}