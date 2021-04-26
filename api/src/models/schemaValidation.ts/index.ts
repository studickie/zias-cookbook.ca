import Ajv from 'ajv';
import AJVSchemaValidation from './AJVSchemaValidation';
import readSchema from './readSchema';

type SchemaName = 
    | 'account'
    | 'recipie';

export interface ISchemaValidation {
    validate: (model: unknown) => unknown;
};

const ajv = new Ajv({ 
    allErrors: true 
});

export default function schemaValidation(schemaName: SchemaName): ISchemaValidation {
    const schema = readSchema(schemaName);

    return new AJVSchemaValidation(ajv, schema);
}