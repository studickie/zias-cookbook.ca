import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { ErrorBadRequest } from '../../helpers/error/ApplicationError';

/*
    expects:
    1.  length to be between 8 and 16 characters long
    2.  contain at least one lowercase character
    3.  contain at least one uppercase character
    4.  contain at least three numeric values     
*/
const passwordRegex = new RegExp(/(?=(^\w{8,16})$)(?=([^a-z]*[a-z]))(?=(?:[^A-Z]*[A-Z]))(?=(\D*\d){3,})/);

export function authFormValidationRules(): ValidationChain[] {
    return [
        body('email').isEmail().normalizeEmail(),
        body('password').matches(passwordRegex)
    ];
}

export function authFormValidationMiddleware(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return next(new ErrorBadRequest(JSON.stringify(errors.mapped())));
    }

    return next();
}