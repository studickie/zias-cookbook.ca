import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { ErrorBadRequest } from '../../helpers/error/ApplicationError';

export function recipeInsertFormValidationRules(): ValidationChain[] {
    return [
        body('title').exists().trim().notEmpty().blacklist('@#$%^_-{}[]`'),
        body('ingredients.*.item').exists().trim().notEmpty().blacklist('@#$%^_-{}[]`'),
        body('ingredients.*.measurement').if(body('ingredients.*.measurement').exists()).trim().notEmpty().isInt(),
        body('ingredients.*.measuringUnit').if(body('ingredients.*.measurement').exists()).trim().notEmpty().blacklist('@#$%^_-{}[]`')
    ];
}

export function recipeInsertFormValidation(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new ErrorBadRequest(JSON.stringify(errors.array())));
    }

    return next();
}