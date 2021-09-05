import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { ErrorBadRequest } from '../../helpers/ApplicationError';

export function authFormValidationRules(): ValidationChain[] {
    return [
        body('email').trim().isEmail().normalizeEmail(),
        /*
            TIP: strong password defaults: 
                min-length: 0
                min-uppercase: 1
                min-lowercase: 1
                min-symbols: 1
        */
        body('password')
        .trim()
        .custom(value => !new RegExp(/^[{}$<>]/).test(value))
        .withMessage('Password cannot contain characters { } $ < >')
        .isStrongPassword()
        .withMessage('Password must be 8 characters long and contain 1 uppercase, 1 lowercase, 1 number and 1 symbol')
    ];
}

export function authFormValidationMiddleware(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return next(new ErrorBadRequest(JSON.stringify(errors.mapped())));
    }

    return next();
}