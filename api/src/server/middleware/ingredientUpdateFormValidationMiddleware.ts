import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { ErrorBadRequest } from '../../helpers/ApplicationError';

export function ingredientUpdateFormValidationRules(): ValidationChain[] {
    return [
        body('item').trim().notEmpty().blacklist('@#$%^_-{}[]`'),
        body('measurement').trim().notEmpty().isInt(),
        body('measuringUnit').trim().notEmpty().blacklist('@#$%^_-{}[]`')
    ];
}

export function ingredientUpdateFormValidation(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new ErrorBadRequest(JSON.stringify(errors.array())));
    }

    return next();
}