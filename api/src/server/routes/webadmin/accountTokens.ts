import express from 'express';
import catchAsync from '../../helpers/catchAsync';
import loadEnv from '../../../helpers/loadEnv';
import { accountTokens } from './';
import AccountTokens from '../../../database/models/AccountTokens';

const { 
    CLIENT_DOMAIN, 
    ACCOUNT_SECRET 
} = loadEnv("CLIENT_DOMAIN", "ACCOUNT_SECRET");

const router = express.Router();

router.post(accountTokens.post, catchAsync(async (req, res) => {

        const jwToken = await AccountTokens.insertCreateAccountPermission(ACCOUNT_SECRET);

        // TODO: emit webadmin event;

        return res.status(200).json({ 
            authUrl: `${CLIENT_DOMAIN}?token=${jwToken}`
        });
    })
);

export default router;