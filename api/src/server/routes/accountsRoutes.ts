import express from 'express';
import catchAsync from '../helpers/catchAsync';
import accounts from '../../database/models/accountsModel';
import jwToken from '../../helpers/jwToken';
//import googleService from '../../services/GoogleService';
import googleService from '../../services/GoogleService2';

const router = express.Router();

router.get('/authenticate/google', catchAsync(async (req, res) => {
    //const authUrl = googleService.generateAuthenticationUrl('basic');

    // return res.status(200).json({ authUrl });
    return res.status(200).json({ messge: 'good check' });
}));

router.post('/authenticate/google', catchAsync(async (req, res) => {
    const { id_token } = req.body;

    const userInfo = await googleService.verify(id_token);
    //const decodedToken = decodeURIComponent(auth_token);

    //const userInfo = await googleService.verifyAuthenticationCode(decodedToken);

    // const matchedAccount = await accounts.findOne({ googleId: userInfo.user.id });

    // let accountId: string;
    // if (matchedAccount) {
    //     accountId = matchedAccount.id;

    // } else {
    //     const accountDoc = await accounts.create({
    //         googleId: (userInfo.user.id as string),
    //         googleToken: (userInfo.tokens.access_token as string),
    //         googleRef: userInfo.tokens.refresh_token || undefined
    //     });

    //     accountId = accountDoc.id;
    // }

    // const token = jwToken.generate({ account: accountId });

    return res.status(200).json({ userInfo });
}));

export default router;