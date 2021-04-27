import express from 'express';
import cors from 'cors';
import catchErrorMiddleware from './server/middleware/catchErrorMiddleware';
import verifyTokenMiddleware from './server/middleware/verifyTokenMiddleware';
import accountsRoutes from './server/routes/accountsRoutes';
import recipiesRoutes from './server/routes/recipiesRoutes';
import databaseLoader from './database';

async function startup() {
    try {
        await databaseLoader();

        const app = express();

        if (process.env.NODE_ENV === 'development') {
            /* 
                Production server has own rules for CORS. 
                Use middleware in development only
            */
            app.use(cors());
        }

        app.use(express.json());

        app.use('/accounts', accountsRoutes);
        app.use('/accounts/recipies', verifyTokenMiddleware, recipiesRoutes);

        app.use(catchErrorMiddleware);

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });

    } catch (e) {
        // TODO: log error

        process.exit(1);
    }
}

startup();