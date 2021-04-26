import express from 'express';
import cors from 'cors';
//import cookieParser from 'cookie-parser';
import useError from './middleware/useError';
import accountsRoutes from './routes/accountsRoutes';
import databaseLoader from '../database';
import logEvent from '../logger';

async function startup() {
    try {
        const nodeEnv = process.env.NODE_ENV || 'production';

        const dbContext = await databaseLoader();

        //* Framework configuration
        const app = express();
        
        //* Configure middleware

        app.use(cors({
            credentials: true, 
            origin: 'http://localhost:3000'
        }));
        //app.use(cookieParser(secret));
        app.use(express.json());
        //app.use(express.urlencoded({ extended: true }));

        //* Configure routes
        /* 
            Primary routes:
            1) Account: Account and subroutes handle requests related to the owner of the account 
                - e.g.: authentication, authored recipies 
            2) Search: handles search operations which are available without an account
        */
        app.use('/accounts', accountsRoutes);

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

startup();