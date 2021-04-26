import Ajv, { ValidateFunction } from 'ajv';
import { ISchemaValidation } from './';

export default class AJVSchemaValidation implements ISchemaValidation {
    private _validate: ValidateFunction;

    constructor(ajv: Ajv, schema: unknown) {
        this._validate = ajv.compile((schema as any));
    }

    validate(model: unknown): unknown {
        this._validate(model);
        
        return this._validate.errors || null;
    }
}