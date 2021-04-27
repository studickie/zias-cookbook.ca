import path from 'path';
import fs from 'fs';
import Ajv from 'ajv';

type SchemaName =
    | 'account'
    | 'recipie';

const nodePath = process.env.NODE_PATH;

/**
 * Retrieves the requested JSON schema
 * 
 * Uses synchronous fs.readFile to ensure schema is retrieved before being requested
 * 
 * If operation fails to find requested file the program should exit
 * 
 * @param schemaName filename; without file extension
 */
function readSchema(schemaName: string): unknown {
    try {
        if (!nodePath) {
            throw new Error('Undefined environment variable')
        }

        const filePath = path.join(nodePath, `/schemas/${schemaName}.json`)

        const data = fs.readFileSync(filePath, 'utf8');

        return JSON.parse(data);

    } catch (e) {
        // TODO: log error

        process.exit(1);
    }
}

export type ISchemaValidation = (model: unknown) => unknown;
export type ValidationLoader = (schemaName: SchemaName) => ISchemaValidation;

export default function schemaValidation(): ValidationLoader {
    const ajv = new Ajv({
        allErrors: true
    });

    return schemaName => {
        const schema = readSchema(schemaName);
        const validate = ajv.compile((schema as any));

        return obj => {
            validate(obj);

            return validate.errors || null;
        }
    }
}