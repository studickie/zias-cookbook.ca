import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
//import cors from 'cors';
import authRoutes from './server/routes/authRoutes';
//import ouath2Routes from './server/routes/ouath2Routes';
import recipesRoutes from './server/routes/recipesRoutes';
//import ingredientsRoutes from './server/routes/ingredientsRoutes';
import databaseLoader from './database';
import { ErrorNotFound, IApplicationError } from './helpers/ApplicationError';
import logger from './helpers/logger';

async function startup() {
    try {
        await databaseLoader();

        const app = express();

        app.use(helmet());
        app.use(express.json());

        app.use(authRoutes);
        //app.use(ouath2Routes);
        app.use(recipesRoutes);
        //app.use(ingredientsRoutes);

        app.use('*', (req, res, next) => next(new ErrorNotFound()));

        app.use((err: IApplicationError, req: Request, res: Response, next: NextFunction) => {

            logger.warn({
                method: req.method,
                path: req.path,
                status: err.statusCode || 500,
                name: err.name,
                message: err.message,
                trace: err.stack,
            });

            return res.status(err.statusCode || 500).json({
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