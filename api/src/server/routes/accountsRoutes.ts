import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/authenticate/google', (req: Request, res: Response, next: NextFunction) => {
    try {
        //const authUrl = googleService.generateAuthenticationUrl('basic');
        
        return res.status(200).json({ 
            //auth_url: authUrl 
        });

    } catch (e) {
        // TODO: proper logging
        console.log(`[ERROR]: GET /google/authenticate - ${e}`);

        return next(e);
    }
});

router.post('/authenticate/google', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { auth_token } = req.body;
        const decodedToken = decodeURIComponent(auth_token);

        //const userInfo = await googleService.verifyAuthenticationCode(decodedToken);

        // TODO: should be update; pass new access_token, refresh_token if available
        // const existingUser = await users.findOne({ googleId: userInfo.user.id });

        // let userId: string;
        // if (existingUser) {
        //     userId = (existingUser._id as string);
        // } else {
        //     const newUser = await users.create({
        //         googleId: (userInfo.user.id as string),
        //         googleToken: (userInfo.tokens.access_token as string),
        //         googleRef: userInfo.tokens.refresh_token || undefined
        //     });

        //     if (!newUser) {
        //         return next(new Error('Oops! Something went wrong.'));
        //     }

        //     userId = (newUser._id as string);
        // }

        // const token = tokenService.generate({ user: userId });
        
        // res.cookie('refresh_token', token, {
        //     maxAge: 1000 * 60 * 60 * 60 * 2,
        //     httpOnly: true
        // });

        return res.status(200).json({
            check: 'Good Check!',
            //userInfo
        });

    } catch (e) {
        console.log(`[ERROR]: POST /google/authenticate - ${e}`);

        return next(e);
    }
});

export default router;