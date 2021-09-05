import express from 'express';
import catchAsync from '../../helpers/catchAsync';
import { scopes as routes } from "./";
import GoogleService from "../../../services/GoogleService";

const router = express.Router();

router.get(
    routes.get,
    catchAsync(async (req, res) => {

        const { code = "" } = req.query as { 
            code: string | undefined 
        };

        const googleService = new GoogleService();

        const oauth2Url = googleService.generateAuthenticationUrl("basic", code);

        res.status(200).json({
            oauth2Url: oauth2Url
        });

    }));

export default router;