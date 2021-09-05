import express from 'express';
import { instructions as routes } from '.';
import catchAsync from '../../helpers/catchAsync';
//import { ErrorNotFound } from '../../helpers/ApplicationError';
import verifyTokenMiddleware from '../../middleware/verifyTokenMiddleware';

const router = express.Router();

router.use(verifyTokenMiddleware);

router.get(
    routes.get, 
    catchAsync(async (req, res, next) => {

    return res.status(200).send();
}));

router.get(
    routes.getById, 
    catchAsync(async (req, res, next) => {

    return res.status(200).send();
}));

router.post(
    routes.post,
    catchAsync(async (req, res, next) => {

    return res.status(200).send();
}));

router.put(
    routes.put,
    catchAsync(async (req, res, next) => {

    return res.status(200).send();
}));

router.delete(
    routes.delete,
    catchAsync(async (req, res, next) => {

    return res.status(200).send();
}));

export default router;