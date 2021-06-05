import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
//import catchErrorMiddleware from './server/middleware/catchErrorMiddleware';
//import verifyTokenMiddleware from './server/middleware/verifyTokenMiddleware';
import authRoutes from './server/routes/authRoutes';
import ouath2Routes from './server/routes/ouath2Routes';
import recipesRoutes from './server/routes/recipesRoutes';
import ingredientsRoutes from './server/routes/ingredientsRoutes';
//import recipesRoutes from './server/routes/recipesRoutes';
import databaseLoader from './database';
import { ErrorNotFound, IApplicationError } from './helpers/ApplicationError';
import logger from './logger/winston';

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

        app.use(authRoutes);
        app.use(ouath2Routes);
        app.use(recipesRoutes);
        app.use(ingredientsRoutes);

        app.use('*', (req, res, next) => next(new ErrorNotFound('Invalid Request')));

        app.use((err: IApplicationError, req: Request, res: Response, next: NextFunction) => {

            logger.warn({
                method: req.method,
                pathname: req.path,
                status: err.statusCode || null,
                name: err.name,
                message: err.message,
                trace: err.stack
            });

            res.status(err.statusCode || 500).json({
                name: err.name,
                message: err.message
            });
        });

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });

    } catch (error) {
        logger.error(error);

        process.exit(1);
    }
}

startup();