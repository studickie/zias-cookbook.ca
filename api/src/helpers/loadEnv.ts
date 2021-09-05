type EnvironmentVariables =
    | "AUTH_SECRET"
    | "ACCOUNT_SECRET"
    | "CLIENT_DOMAIN";

/**
 * loadEnv
 * 
 * @description
 * Ensures requested environment variables are loaded with string values
 * 
 * @param envKeys Comma-separated environment variable names
 * 
 * @returns 
 * Returns an object whose keys are the environment variables which were passed
 * as arguments and whose values are typeof string;
 */
export default function loadEnv<T extends EnvironmentVariables>(...envKeys: T[]): Record<T, string> {
    return envKeys.reduce((acc, key) => {
        const value = process.env[key];

        if (!value) {
            throw new Error(`Undefined environment variable ${key}`);
        }

        acc[key] = value;

        return acc;

    }, {} as Record<T, string>);
}