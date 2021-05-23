import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { ErrorBadRequest } from '../../helpers/error/ApplicationError';

export function ingredientUpdateFormValidationRules(): ValidationChain[] {
    return [
        body().custom((args) => {
            if (Object.keys(args).length < 1) {
                throw new Error('Invalid argument');
            }
            
            const checkArr = Object.keys(args).filter(key => ['item', 'measurement', 'measuringUnit'].indexOf(key) < 0);

            if (checkArr.length > 0) {
                throw new Error('Invalid argument');
            }

            return true;
        }),
        body('item').if(body('item').exists()).trim().notEmpty().blacklist('@#$%^_-{}[]`'),
        body('measurement').if(body('measurement').exists()).trim().notEmpty().isInt(),
        body('measuringUnit').if(body('measuringUnit').exists()).trim().notEmpty().blacklist('@#$%^_-{}[]`')
    ];
}

export function ingredientUpdateFormValidation(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new ErrorBadRequest(JSON.stringify(errors.array())));
    }

    return next();
}