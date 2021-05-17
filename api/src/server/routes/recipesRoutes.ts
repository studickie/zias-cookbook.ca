import express from 'express';
import catchAsync from '../helpers/catchAsync';
import Recipes from '../../database/models/RecipesModel';
import { recipes as routes } from './routes';

const router = express.Router();

/*
    Retrieves all recipes where the requesting account's id is listed in the 
    recipie's "authoredBy" or "subscribers" property
 */
router.get(routes.find, catchAsync(async (req, res) => {

    return res.status(200).json({ });
}));

/*
    Retrieves a single recipe where the recipie's id matches the search param and 
    the requesting account's id is listed in the recipie's "authoredBy" or "subscribers" property
 */
router.get(routes.findOne, catchAsync(async (req, res) => {

    return res.status(200).json({ });
}));

/*
    Creates a new recipe and set the requesting account's id as the recipie's
    "authoredBy" property
 */
router.post(routes.insert, catchAsync(async (req, res) => {

    // TODO: add sanitization to form fields

    const recipe = await Recipes.create({
        title: req.body.title
    });

    return res.status(200).json({ recipe });
}));

/*
    Updates an existing recipe where the recipie's id matches the search param and 
    the recipie's "authoredBy" property matches the id of the requesting account

    Recipie properties which can be updated should be restricted to: title, subscribers
 */
router.put(routes.update, catchAsync(async (req, res) => {

    return res.status(200).json({  });
}));

/*
    Deletes an existing recipe where the recipie's id matches the search param and 
    the recipie's "authoredBy" property matches the id of the requesting account

    Supporting the ability for other accounts to subscribe to any recipie means a recipie
    should not be able to be completely deleted from DB. This method should only serve to 
    remove an account from being subscribed to the recipie.
 */
router.delete(routes.remove, catchAsync(async (req, res) => {

    return res.status(200).json({  });
}));

export default router;