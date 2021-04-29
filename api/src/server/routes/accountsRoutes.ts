import express from 'express';
import catchAsync from '../helpers/catchAsync';
import accounts from '../../database/models/accountsModel';
import jwToken from '../../helpers/jwToken';
import googleService from '../../services/GoogleService';

const router = express.Router();

router.get('/authenticate/google', catchAsync(async (req, res) => {
    const authUrl = googleService.generateAuthenticationUrl('basic');

    return res.status(200).json({ authUrl });
}));

router.post('/authenticate/google', catchAsync(async (req, res) => {
    const { auth_token } = req.body;
    const decodedToken = decodeURIComponent(auth_token);

    const userInfo = await googleService.verifyAuthenticationCode(decodedToken);

    const matchedAccount = await accounts.findOne({ googleId: userInfo.user.id });

    let accountId: string;
    if (matchedAccount) {
        accountId = matchedAccount.id;

    } else {
        const accountDoc = await accounts.create({
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