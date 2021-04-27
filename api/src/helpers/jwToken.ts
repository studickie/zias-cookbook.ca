import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;

export default (function jwToken(): {
    generate: (data: unknown) => string;
    verify: (token: string) => unknown;
} {
    try {
        if (!secret) {
            throw new Error('Undefined environment variable');
        }

        return {
            generate: data => {
                return jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: data
                }, secret);
            },
            verify: token => {
                return jwt.verify(token, secret);
            }
        };

    } catch (e) {
        // TODO: log error
        
        process.exit(1);
    }
})();