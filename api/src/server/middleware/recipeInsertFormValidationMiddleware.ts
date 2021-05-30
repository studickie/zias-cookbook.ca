import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { ErrorBadRequest } from '../../helpers/ApplicationError';

export function recipeInsertFormValidationRules(): ValidationChain[] {
    return [
        body('title').trim().notEmpty().blacklist('@#$%^_-{}[]`'),
        body('category').isInt(),
        body('ingredients.*.item').trim().notEmpty().blacklist('@#$%^_-{}[]`'),
        body('ingredients.*.measurement').isInt(),
        body('ingredients.*.measuringUnit').trim().notEmpty().blacklist('@#$%^_-{}[]`')
    ];
}

export function recipeInsertFormValidation(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new ErrorBadRequest(JSON.stringify(errors.array())));
    }

    return next();
}