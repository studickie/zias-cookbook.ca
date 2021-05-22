import express from 'express';
import catchAsync from '../helpers/catchAsync';
import Recipes from '../../database/models/RecipesModel';
import { recipes as routes } from './routes';
import verifyTokenMiddleware from '../middleware/verifyTokenMiddleware';

const router = express.Router();

/*
    Retrieves all recipes where the requesting account's id is listed in the 
    recipie's "authoredBy" or "subscribers" property
 */
router.get(routes.find, verifyTokenMiddleware, catchAsync(async (req, res) => {
    const recipes = await Recipes.find({ 
        authoredBy: req.accountId 
    });

    return res.status(200).json({ recipes });
}));

/*
    Retrieves a single recipe where the recipie's id matches the search param and 
    the requesting account's id is listed in the recipie's "authoredBy" or "subscribers" property
 */
router.get(routes.findOne, verifyTokenMiddleware, catchAsync(async (req, res) => {
    const recipe = await Recipes.findOne({
        _id: req.params.recipeId,
        authoredBy: req.accountId 
    });

    return res.status(200).json({ recipe });
}));

/*
    Creates a new recipe and set the requesting account's id as the recipie's
    "authoredBy" property
 */
router.post(routes.insert, verifyTokenMiddleware, catchAsync(async (req, res, next) => {
    
    const createdRecipe = await Recipes.createRecipe({
        title: req.body.title,
        authoredBy: req.accountId,
        ingredients: req.body.ingredients
    });

    if (!createdRecipe) {
        return next(new Error('Oops! Something went wrong'));
    }

    return res.status(200).json({ recipeId: createdRecipe._id });
}));

/*
    Updates an existing recipe where the recipie's id matches the search param and 
    the recipie's "authoredBy" property matches the id of the requesting account

    Recipie properties which can be updated should be restricted to: title, subscribers
 */
router.put(routes.update, verifyTokenMiddleware, catchAsync(async (req, res) => {

    return res.status(200);
}));

/*
    Deletes an existing recipe where the recipie's id matches the search param and 
    the recipie's "authoredBy" property matches the id of the requesting account

    Supporting the ability for other accounts to subscribe to any recipie means a recipie
    should not be able to be completely deleted from DB. This method should only serve to 
    remove an account from being subscribed to the recipie.
 */
router.delete(routes.remove, verifyTokenMiddleware, catchAsync(async (req, res, next) => {
    const result = await Recipes.archiveRecipe(req.params.recipeId, req.accountId);

    if (!result) {
        return next(new Error('Oops! Something went wrong.'));
    }

    return res.status(200);
}));

export default router;