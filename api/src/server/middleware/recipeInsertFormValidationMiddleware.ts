import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { ErrorBadRequest } from '../../helpers/ApplicationError';

export function recipeInsertFormValidationRules(): ValidationChain[] {  
    return [
        body('title').whitelist('a-zA-Z0-9\-\(\)&#\',\\s').trim().exists({ checkFalsy: true }),
        body('categories').exists({ checkFalsy: true }).isArray(),
        body('categories.*').toInt().isInt({ gt: -1, lt: 7 }),
        body('directions').exists({ checkFalsy: true }).isArray(),
        body('directions.*').whitelist('a-zA-Z0-9\-\',\\s'),
        body('ingredients').exists({ checkFalsy: true }).isArray(),
        body('ingredients.*.groupId').toInt().isInt(),
        body('ingredients.*.label').whitelist('a-zA-Z0-9\-\',\\s').trim().exists({ checkFalsy: true }),
        body('ingredients.*.value').toInt().isInt(),
        body('ingredients.*.unit').whitelist('a-zA-Z').trim(),
        body('ingredientGroups').exists({ checkFalsy: true }).isArray(),
        body('ingredientGroups.*.label').whitelist('a-zA-Z0-9\-\'\\s').trim(),
        body('ingredientGroups.*.groupId').toInt().isInt()
    ];
}

export function recipeInsertFormValidation(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new ErrorBadRequest(JSON.stringify(errors.array())));
    }

    return next();
}