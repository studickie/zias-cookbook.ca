import express from 'express';
import cors from 'cors';
import useError from './middleware/useError';
import authRoutes from './routes/authRoute';
import rootRoutes from './routes/rootRoute';
import dbConnect from '../database';
import logEvent from '../logger';
//import nodemailerStartup from '../mailer';
import authToken from '../helpers/authToken';
import googleService from '../google';

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

        const googleClientId = process.env.GOOGLE_CLIENT_ID;

        if (googleClientId === undefined) throw new Error('"googleService" is undefined');

        const google = googleService(googleClientId);

        //* Framework configuration
        const app = express();
        
        //* Configure middleware

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        //* Configure routes
        const router = express.Router();
        app.use('/', rootRoutes(router));
        app.use('/auth', authRoutes(router, { dbAccess, authToken: tokenService, google }));

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