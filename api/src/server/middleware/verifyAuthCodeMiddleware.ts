import { Request, Response, NextFunction } from 'express';
import { ErrorUnauthorized } from '../../helpers/ApplicationError';
import AccountCodes from '../../database/mongooseModels/AccountCodesModel';

export default async function verifyAuthCodeMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { code, email } = req.body;
    
    if (!code || !email) {
        return next(new ErrorUnauthorized('Invalid request'));
    }
    
    const verified = await AccountCodes.deleteOne({
        code: code,
        accountEmail: email,
        expiresAt: {
            $gt: new Date()
        }
    });

    if (!verified.deletedCount || verified.deleteCode < 1) {
        return next(new ErrorUnauthorized('Invalid verfication code'));
    }

    return next();
}