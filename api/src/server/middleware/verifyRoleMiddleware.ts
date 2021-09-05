import { Request, Response, NextFunction } from 'express';
import { AccountRoles } from '../../entities/Account';
import { ErrorBadRequest } from '../../helpers/ApplicationError';
import Accounts from '../../database/models/Accounts';

export default async function verifyRoleMiddleware(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    
    const account = await Accounts.findOne({ email });

    if (!account || account.role !== AccountRoles.super) {
        return next(new ErrorBadRequest());
    }

    return next();
}
