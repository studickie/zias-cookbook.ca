import express from 'express';
import { oauth2 as routes } from './routes';
import catchAsync from '../helpers/catchAsync';
import Accounts from '../../database/mongooseModels/AccountsModel';
import jwToken from '../../helpers/jwToken';
import { ErrorBadRequest } from '../../helpers/ApplicationError';
import googleService from '../../services/GoogleService';

const router = express.Router();

router.get(routes.googleUrl, catchAsync(async (req, res) => {
    const authUrl = googleService.generateAuthenticationUrl('basic');

    return res.status(200).json({ authUrl });
}));

router.post(routes.googleVerifySignup, catchAsync(async (req, res, next) => {
    const { auth_token } = req.body;
    const decodedToken = decodeURIComponent(auth_token);

    const userInfo = await googleService.verifyAuthenticationCode(decodedToken);

    const account = await Accounts.findOne({ googleId: (userInfo.user.id as string) });

    if (account) {
        return next(new ErrorBadRequest('Account already exists'));
    }

    const accountDoc = await Accounts.create({
        googleId: (userInfo.user.id as string),
        googleToken: (userInfo.tokens.access_token as string),
        googleRef: userInfo.tokens.refresh_token || undefined
    });

    const token = jwToken.generate({ account: accountDoc._id });

    return res.status(200).json({ token });
}));

router.post(routes.googleVerifySignin, catchAsync(async (req, res, next) => {
    const { auth_token } = req.body;
    const decodedToken = decodeURIComponent(auth_token);

    const userInfo = await googleService.verifyAuthenticationCode(decodedToken);

    const account = await Accounts.findOne({ googleId: (userInfo.user.id as string) });

    if (!account) {
        return next(new ErrorBadRequest('Account does not exist'));
    }

    const token = jwToken.generate({ account: account._id });

    return res.status(200).json({ token });
}));

export default router;