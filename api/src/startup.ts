import express from 'express';
import cors from 'cors';
import databaseLoader from './database';
import modelsLoader from './models';
import servicesLoader from './services';
import errorMiddleware from './server/middleware/errorMiddleware';
import accountsRoutes from './server/routes/accountsRoutes';

async function startup(): Promise<void> {
    try {
        const dbAccess = await databaseLoader();

        const models = modelsLoader();

        const services = servicesLoader();

        /* 
            Configure server framework - Express.js
        */
        const app = express();
        
        if (process.env.NODE_ENV === 'development') {
            /*
                CORS is handled by server in production environment; no need to add 
                it to middleware pipeline
            */
            app.use(cors());
        }

        app.use(express.json());

        app.use('/accounts', accountsRoutes(models.accounts, dbAccess.accounts, services.google));

        app.use(errorMiddleware);

        app.listen(process.env.PORT);
        
    } catch (e) {
        // TODO: log error

        process.exit(1);
    } finally {
        // TODO: log startup event
    }
}

startup();