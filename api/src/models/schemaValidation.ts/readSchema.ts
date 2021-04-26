import path from 'path';
import fs from 'fs';
import logEvent from '../../logger'

const nodePath = process.env.NODE_PATH || '';

/**
 * Retrieves the requested JSON schema.
 * 
 * Uses synchronous fs.readFile to ensure schema is retrieved before being requested.
 * 
 * If operation fails to find requested file the program should exit.
 * 
 * @param schemaName filename; without file extension
 * @returns 
 */
export default function readSchema(schemaName: string): unknown {
    try {
        const filePath = path.join(nodePath, `/schemas/${schemaName}.json`)

        const data = fs.readFileSync(filePath, 'utf8');

        return JSON.parse(data);

    } catch (e) {
        logEvent.emit('error', e);

        process.exit(1);
    }
}