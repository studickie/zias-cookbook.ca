import { Request, Response, NextFunction } from 'express';
import { body, param, ValidationChain, validationResult } from 'express-validator';
import { ErrorBadRequest } from '../../helpers/error/ApplicationError';

export function recipeUpdateFormValidationRules(): ValidationChain[] {
    return [
        param('recipeId').isMongoId(),
        body('title').exists().trim().notEmpty().blacklist('@#$%^_-{}[]`')
    ];
}

export function recipeUpdateFormValidation(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new ErrorBadRequest(JSON.stringify(errors.array())));
    }

    return next();
}