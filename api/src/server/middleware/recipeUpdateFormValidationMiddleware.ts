import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { ErrorBadRequest } from '../../helpers/ApplicationError';

export function recipeUpdateFormValidationRules(): ValidationChain[] {
    return [
        body().custom(args => {
            const keys = Object.keys(args);

            if (keys.length < 1) return false;
            
            const result = keys.filter(key => ['title', 'category'].indexOf(key) < 0);

            if (result.length > 0) return false;

            return true;
        }),
        body('title').if(body('title').exists()).trim().notEmpty().blacklist('@#$%^_-{}[]`'),
        body('category').if(body('category').exists()).isInt()
    ];
}

export function recipeUpdateFormValidation(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new ErrorBadRequest(JSON.stringify(errors.array())));
    }

    return next();
}