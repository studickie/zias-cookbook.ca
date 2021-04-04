import { Router, Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';

const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleSecret = process.env.GOOGLE_SECRET || '';
const googleRedirect = process.env.GOOGLE_REDIRECT_URI || '';

export default function authRoutes (router: Router): Router {

    const oauth2Client = new google.auth.OAuth2(googleClientId, googleSecret, googleRedirect);

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ];

    router.get('/google/authenticate', (req: Request, res: Response, next: NextFunction) => {
        try {
            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes
            });

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
        try {
            const {auth_token} = req.body;
            
            const {tokens} = await oauth2Client.getToken(auth_token);

            return res.status(200).json({
                check: 'Good Check!',
                tokens: tokens
            });

        } catch (e) {
            console.log(`[ERROR]: POST /google/authenticate - ${e}`);

            return next(e);
        }
    });

    return router;
}