import Ajv, { ValidateFunction } from 'ajv';

export default class AJVSchemaValidation<T> {
    private _validate: ValidateFunction<T>;

    constructor(ajv: Ajv, schema: T) {
        this._validate = ajv.compile<T>(schema);
    }

    validateSchema (data: T): unknown {
        this._validate(data);

        return this._validate.errors || null;
    }
}