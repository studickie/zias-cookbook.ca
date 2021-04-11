import express, {Request, Response, NextFunction} from 'express';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
const MongoStore = MongoDBStore(session);
import cors from 'cors';
import useError from './middleware/useError';
//import authRoutes from './routes/authRoutes';
import oauthRoutes from './routes/oauth2Routes';
import rootRoutes from './routes/rootRoutes';
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

        const sessionStore = new MongoStore({
            uri: `mongodb://${dbUser}:${dbPass}@${dbHost}/${dbName}`,
            collection: 'sessions'
        });

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
        app.use(session({
            secret: 'session!secret?',
            cookie: {
                maxAge: 1000 * 60 * 60,
                httpOnly: true
            },
            store: sessionStore,
            resave: false,
            saveUninitialized: false
        }));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        //* Configure routes
        const router = express.Router();
        app.get('/', async (req: Request, res: Response, next: NextFunction) => {
            return res.status(200).json({ message: "Good Request?", session: req.session});
        });
        
        app.use('/oauth2', oauthRoutes(router, { googleService, dbAccess }));

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