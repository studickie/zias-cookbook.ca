import express, { Router } from 'express';
import Accounts from '../../models/Accounts';
import AccountsDAO from '../../database/dao/AccountsDAO';
import GoogleService from '../../services/GoogleService';
import catchAsync from '../helpers/catchAsync';
import { DbAccount } from '../../database/mongodb/dataTypes';
import jwToken from '../../helpers/jwToken';

export default function accountsRoute(
    accounts: Accounts,
    dbAccounts: AccountsDAO,
    googleService: GoogleService
): Router {

    const router = express.Router();

    router.get('/authenticate/google', catchAsync(async (req, res) => {
        const authUrl = googleService.generateAuthenticationUrl('basic');

        return res.status(200).json({ authUrl });
    }));

    router.post('/authenticate/google', catchAsync(async (req, res, next) => {
        const { auth_token } = req.body;
        const decodedToken = decodeURIComponent(auth_token);

        const userInfo = await googleService.verifyAuthenticationCode(decodedToken);

        const matchedAccount = await dbAccounts.findOne({ googleId: (userInfo.user.id as string) });

        let accountId: string;
        if (matchedAccount) {
            accountId = (matchedAccount._id as string);

        } else {
            const createdAccount = await accounts.create({
                googleId: (userInfo.user.id as string),
                googleToken: (userInfo.tokens.access_token as string),
                googleRef: userInfo.tokens.refresh_token || undefined
            });

            if (!createdAccount) {
                return next(new Error('Oops! Something went wrong.'));
            }

            accountId = ((createdAccount as DbAccount)._id as string);
        }

        const token = jwToken.generate({ account: accountId });

        // res.cookie('refresh_token', token, {
        //     maxAge: 1000 * 60 * 60 * 60 * 2,
        //     httpOnly: true
        // });

        return res.status(200).json({ token });
    }));

    return router;
}