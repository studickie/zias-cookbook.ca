import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import useError from './middleware/useError';
import accountRoutes from './routes/accountRoutes';
import dbConnect from '../database';
import logEvent from '../logger';
//import nodemailerStartup from '../mailer';
import authToken from '../helpers/authToken';
import GoogleService from '../google';

async function main() {
    try {
        const nodeEnv = process.env.NODE_ENV || 'production';

        const dbHost = process.env.DB_HOST || '';
        const dbName = process.env.DB_NAME || '';
        const dbUser = process.env.DB_USER || '';
        const dbPass = process.env.DB_PASS || '';

        const dbAccess = await dbConnect(dbHost, dbName, dbUser, dbPass);

        // Mail Service
        // const mailHost = process.env.MAIL_HOST || '';
        // const mailUser = process.env.MAIL_USER || '';
        // const mailPass = process.env.MAIL_PASS || '';

        // const mailService = nodemailerStartup(mailHost, mailUser, mailPass);

        const secret = process.env.SECRET;

        if (secret === undefined) throw new Error('"authToken" is undefined');

        const tokenService = authToken(secret);

        const googleService = GoogleService();

        //* Framework configuration
        const app = express();
        
        //* Configure middleware

        app.use(cors({
            credentials: true, 
            origin: 'http://localhost:3000'
        }));
        app.use(cookieParser(secret));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        //* Configure routes

        const router = express.Router();
        /* 
            Primary routes:
            1) Account: Account and subroutes handle requests related to the owner of the account - e.g.: authentication, recipie CRUD op's
            2) Search: handles search operations which are available without an account
        */
        app.use('/account', accountRoutes(router, { googleService, dbAccess, tokenService }));

        app.use(useError);

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });

    } catch (e) {
        logEvent.on('error', e);

        process.exit(1);
    }
}

main();