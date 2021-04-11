import { Router, Request, Response, NextFunction } from 'express';

export default function rootRoutes (router: Router): Router {

    router.get('/', (req: Request, res: Response, next: NextFunction) => {

        return res.status(200).json({ message: "Good Request!", session: req.sessionID});
    });

    return router;
}