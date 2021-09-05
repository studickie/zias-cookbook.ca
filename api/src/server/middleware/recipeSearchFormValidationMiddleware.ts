import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { ErrorBadRequest } from '../../helpers/ApplicationError';

export function recipeSearchFormValidationRules(): ValidationChain[] {  
    return [
        body('categories').exists({ checkFalsy: true }).isArray(),
        body('categories.*').toInt().isInt({ gt: -1, lt: 7 }),
        body('searchKeywords').exists({ checkFalsy: true }).isArray(),
        body('searchKeywords.*').whitelist('a-zA-Z0-9\-\',\\s').trim().exists({ checkFalsy: true })
    ];
}

export function recipeSearchFormValidation(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new ErrorBadRequest(JSON.stringify(errors.array())));
    }

    return next();
}