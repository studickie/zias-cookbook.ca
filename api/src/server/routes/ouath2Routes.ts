import express from 'express';
import { oauth2 } from './routes';
import catchAsync from '../helpers/catchAsync';
import Accounts from '../../database/mongooseModels/AccountsModel';
import jwToken from '../../helpers/jwToken';
import googleService from '../../services/GoogleService';

const router = express.Router();

router.get(oauth2.googleUrl, catchAsync(async (req, res) => {
    const authUrl = googleService.generateAuthenticationUrl('basic');

    return res.status(200).json({ authUrl });
}));

router.post(oauth2.googleVerify, catchAsync(async (req, res) => {
    const { auth_token } = req.body;
    const decodedToken = decodeURIComponent(auth_token);

    const userInfo = await googleService.verifyAuthenticationCode(decodedToken);

    const matchedAccount = await Accounts.findOne({ googleId: (userInfo.user.id as string) });

    let accountId: string;
    if (matchedAccount) {
        accountId = matchedAccount.id;

    } else {
        const accountDoc = await Accounts.create({
            googleId: (userInfo.user.id as string),
            googleToken: (userInfo.tokens.access_token as string),
            googleRef: userInfo.tokens.refresh_token || undefined
        });

        accountId = accountDoc.id;
    }

    const token = jwToken.generate({ account: accountId });

    return res.status(200).json({ token });
}));

export default router;