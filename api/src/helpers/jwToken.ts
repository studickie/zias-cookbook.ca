import jwt from 'jsonwebtoken';
import logger from '../logger/winston';

const secret = process.env.SECRET;

function jwToken(): {
    generate: (data: unknown) => string;
    verify: (token: string) => unknown;
} {
    try {
        if (!secret) {
            throw new Error('Unassigned env var');
        }

        return {
            generate: data => (
                jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: data
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