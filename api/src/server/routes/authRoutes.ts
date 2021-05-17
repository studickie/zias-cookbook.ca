import express from 'express';
import { authFormValidationMiddleware, authFormValidationRules } from '../middleware/authFormValidationMiddleware';
import catchAsync from '../helpers/catchAsync';
import { ErrorBadRequest } from '../../helpers/error/ApplicationError';
import { auth as routes } from './routes';
import Accounts from '../../database/models/AccountsModel';
//import MailerService from '../../services/MailerService';

const router = express.Router();

/*
    Create an account with default credentials (email, password) authentication strategy
 */
router.post(routes.signup, /*authFormValidationRules(), authFormValidationMiddleware,*/ catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    const matchedAccount = await Accounts.findOne({ email });
    
    if (matchedAccount !== null) {
        return next(new ErrorBadRequest('Account already exists'));
    }

    const createdAccount = await Accounts.createWithDefaultCredentials({ email, password });

    // TODO: create account
    // TODO: create mongoose meethods (investigate available types and uses) to create account with default credentials
    // TODO: on account created with default credentials: hash password

    // TODO: inform user that account must be verified by webadmin and they will receive an email with further instructions

    return res.status(200).json({
        message: 'Good Check!',
        result: createdAccount
    });
}));

router.post(routes.signin, catchAsync(async (req, res) => {

    return res.status(200).json({
        message: 'Good Check!'
    });
}));

export default router;