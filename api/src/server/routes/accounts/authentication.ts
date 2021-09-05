import express from 'express';
import catchAsync from '../../helpers/catchAsync';
import { basicAuth as routes } from '.';
import Accounts from '../../../database/models/Accounts';
import { ErrorBadRequest, ErrorUnauthorized } from '../../../helpers/ApplicationError';
import jwToken from '../../../helpers/jwToken';
import { CreateAccountRequest } from '../../../contracts/CreateAccountRequest';
import {
    authFormValidationRules,
    authFormValidationMiddleware
} from '../../middleware/authFormValidationMiddleware';
import loadEnv from '../../../helpers/loadEnv';
import { AccountGoogleScopes, AccountRoles } from '../../../entities/Account';
import AccountTokens from '../../../database/models/AccountTokens';
import GoogleService from "../../../services/GoogleService";

const router = express.Router();

const {
    ACCOUNT_SECRET
} = loadEnv("ACCOUNT_SECRET");

// authFormValidationRules(),
// authFormValidationMiddleware,

router.post(routes.signup, catchAsync(async (req, res, next) => {

    const { permissionToken } = req.body;

    if (!permissionToken
        || !await AccountTokens.verifyCreateAccountPermission(permissionToken, ACCOUNT_SECRET)) {
        return next(new ErrorUnauthorized());
    }

    const { email, password, code } = req.body;

    const account = await Accounts.findOne({ email: email });

    if (account) {
        return next(new ErrorBadRequest("Email already assigned to an account"));
    }

    let newAccount;

    if (email && password) {
        newAccount = await Accounts.insertWithBasicAuthStrategy(email, password, AccountRoles.user);

    } else if (email && code) {
        const decoded = decodeURIComponent(code);

        const googleService = new GoogleService();
        const gUser = await googleService.verifyAuthenticationCode(decoded);
        
        newAccount = await Accounts.insertWithGoogleOauth2Strategy(
            email,
            AccountRoles.user,
            gUser.user.id as string,
            {
                access: gUser.tokens.access_token as string,
                refresh: gUser.tokens.refresh_token
            },
            [
                AccountGoogleScopes.basic
            ]
        );

    } else {
        return next(new ErrorBadRequest());
    }

    const token = jwToken.generate({ account: newAccount._id });

    return res.status(200).json({ token: token });
}));

router.post(
    routes.login,
    authFormValidationRules(),
    authFormValidationMiddleware,
    catchAsync(async function signin(req, res, next) {

        const { email, password }: CreateAccountRequest = req.body;

        const account = await Accounts.findOne({ email });

        if (!account || !await account.comparePassword(password)) {
            return next(new ErrorBadRequest('Invalid username or password'));
        }

        const token = jwToken.generate({ account: account._id });

        return res.status(200).json({ token });
    }));

export default router;