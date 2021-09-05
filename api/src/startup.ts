import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import accountTokensRoutes from './server/routes/webadmin/accountTokens';
import authenticationRoutes from './server/routes/accounts/authentication';
import googleScopesRoutes from "./server/routes/google/scopes";
import databaseLoader from './database';
import { ErrorNotFound, IApplicationError } from './helpers/ApplicationError';
import logger from './helpers/logger';

async function startup() {
    try {
        await databaseLoader();

        const app = express();

        app.use(helmet());
        app.use(express.json());

        app.use(accountTokensRoutes);
        app.use(authenticationRoutes);
        app.use(googleScopesRoutes);

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