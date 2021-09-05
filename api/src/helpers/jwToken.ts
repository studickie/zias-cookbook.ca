import jwt from 'jsonwebtoken';
import logger from '../helpers/logger';

const secret = process.env.AUTH_SECRET;

type JwToken = {
    generate: (data: Record<string, unknown>) => string;
    verify: (token: string) => unknown;
}

function jwToken(): JwToken {
    try {
        if (!secret) {
            throw new Error('Unassigned env var');
        }

        return {
            generate: (data: Record<string, unknown>) => (
                jwt.sign({
                    ...{
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    },
                    ...data
                }, secret)
            ),
            verify: token => (
                jwt.verify(token, secret)
            )
        };
    } catch (e) {
        logger.error(e);

        process.exit(1);
    }
}

export default jwToken();