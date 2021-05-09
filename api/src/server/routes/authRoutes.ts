import express from 'express';
import catchAsync from '../helpers/catchAsync';
import { auth as routes } from './routes';
import MailerService from '../../services/MailerService';
import AccountTokens from '../../database/models/AccountTokensModel';

const router = express.Router();

router.post(routes.requestSignup, catchAsync(async (req, res) => {
    const { email } = req.body;

    const requestToken = await AccountTokens.create({
        email: email
    });

    MailerService.sendSignupRequest(email, requestToken._id.toString());

    return res.status(200).json({
        message: 'Request account sent'
    });
}));

router.post(routes.signup, catchAsync(async (req, res) => {

    return res.status(200).json({
        message: 'Good Check!'
    });
}));

router.post(routes.signin, catchAsync(async (req, res) => {

    return res.status(200).json({
        message: 'Good Check!'
    });
}));

export default router;