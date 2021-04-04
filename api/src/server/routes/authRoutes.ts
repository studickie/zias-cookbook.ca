import { Router, Request, Response, NextFunction } from 'express';
import { IGoogleService } from '../../google';
import { AccessConstructor } from '../../database';
import Users from '../../database/repos/UsersRepo';
import { IAuthToken } from '../../helpers/authToken';

interface Services {
    dbAccess: AccessConstructor;
    authToken: IAuthToken;
    google: IGoogleService;
}

export default function authRoutes (router: Router, services: Services): Router {

    const {
        dbAccess,
        authToken,
        google
    } = services;

    router.post('/google_signin', async (req: Request, res: Response, next: NextFunction) => {
        const users = dbAccess(Users);

        try {
            const googleId = await google.verifyAuthToken(req.body.token);

            if (!googleId) {
                return next(new Error('Invalid token'));
            }

            const user = await users.findOne({ googleId: googleId });
            let token: string;

            if (user === null) {
                const newUser = await users.create({ googleId: googleId });

                if (newUser === null) {
                    return next(new Error('Uh-oh! Something went wrong'));
                }

                token = authToken.generate({ user: newUser._id });

            } else {
                token = authToken.generate({ user: user._id });
            }

            return res.status(200).json({ 
                message: 'Successful Google sign-in',
                token: token
             });

        } catch (e) {
            return next(e);
        } finally {
            console.log('[LOG] - /google_signin')
        }
    });

    return router;
}