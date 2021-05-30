import express from 'express';
import { authFormValidationMiddleware, authFormValidationRules } from '../middleware/authFormValidationMiddleware';
import catchAsync from '../helpers/catchAsync';
import { ErrorBadRequest } from '../../helpers/ApplicationError';
import jwToken from '../../helpers/jwToken';
import { auth as routes } from './routes';
import Accounts from '../../database/mongooseModels/AccountsModel';
//import MailerService from '../../services/MailerService';

const router = express.Router();

/*
    Create an account with the default authentication strategy
*/
router.post(
    routes.signup, 
    authFormValidationRules(), 
    authFormValidationMiddleware, 
    catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    const matchedAccount = await Accounts.findOne({ email });
    
    if (matchedAccount !== null) {
        return next(new ErrorBadRequest('Account already exists'));
    }

    const createdAccount = await Accounts.createWithDefaultCredentials({ email, password });

    if (!createdAccount) {
        return next(new Error('Oops! Something went wrong.'));
    }

    // TODO: log account creation event as "info" level

    const jwt = jwToken.generate({
        account: createdAccount._id
    });

    return res.status(200).json({
        message: 'Good Check!',
        access_token: jwt
    });
}));

/*
    Validate user credentials as the default authentication strategy
*/
router.post(
    routes.signin, 
    authFormValidationRules(), 
    authFormValidationMiddleware, 
    catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    const matchedAccount = await Accounts.findOne({ email });

    if (!matchedAccount || !await matchedAccount.comparePassword(password)) {
        return next(new ErrorBadRequest('Invalid username or password'));
    }

    const jwt = jwToken.generate({
        account: matchedAccount._id
    });

    return res.status(200).json({
        message: 'Good Check!',
        access_token: jwt
    });
}));

export default router;