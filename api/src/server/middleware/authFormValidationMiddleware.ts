import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { ErrorBadRequest } from '../../helpers/ApplicationError';

export function authFormValidationRules(): ValidationChain[] {
    return [
        body('email').isEmail().normalizeEmail(),
        body('password').isStrongPassword()
    ];
}

export function authFormValidationMiddleware(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return next(new ErrorBadRequest(JSON.stringify(errors.mapped())));
    }

    return next();
}