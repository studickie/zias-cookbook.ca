import { Router, Request, Response, NextFunction } from 'express';
import { AccessConstructor } from '../../database';
import { IGoogleService } from '../../google';
import Users from '../../database/DAO/UsersDAO';

interface OauthServices {
    dbAccess: AccessConstructor;
    googleService: IGoogleService;
}

export default function authRoutes (router: Router, services: OauthServices): Router {

    const {
        dbAccess,
        googleService
    } = services;

    router.get('/google/authenticate', (req: Request, res: Response, next: NextFunction) => {
        try {
            const authUrl = googleService.generateAuthenticationUrl('basic');
            
            return res.status(200).json({ 
                auth_url: authUrl 
            });

        } catch (e) {
            // TODO: proper logging
            console.log(`[ERROR]: GET /google/authenticate - ${e}`);

            return next(e);
        }
    });

    router.post('/google/authenticate', async (req: Request, res: Response, next: NextFunction) => {
        const users = dbAccess(Users);

        try {
            const { auth_token } = req.body;

            const userInfo = await googleService.verifyAuthenticationCode(auth_token);
            
            // TODO: check if authencticated user exists in DB -> create if not, update access_token if yes

            const existingUser = await users.findOne({ googleId: userInfo.user.id });

            if (existingUser) {
                req.session.user = { 
                    userId: existingUser._id
                };
            } else {
                const newUser = await users.create({
                    googleId: userInfo.user.id,
                    googleToken: userInfo.tokens.access_token,
                    googleRef: userInfo.tokens.refresh_token
                });

                if (!newUser) {
                    return next(new Error('Oops! Something went wrong.'));
                }

                req.session.user = { 
                    userId: newUser._id
                };
            }

            return res.status(200).json({
                check: 'Good Check!',
                tokens: userInfo.tokens,
                user: userInfo.user,
                session: req.session
            });

        } catch (e) {
            console.log(`[ERROR]: POST /google/authenticate - ${e}`);

            return next(e);
        }
    });

    return router;
}