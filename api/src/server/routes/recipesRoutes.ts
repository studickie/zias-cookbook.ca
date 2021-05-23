import express from 'express';
import catchAsync from '../helpers/catchAsync';
import Recipes from '../../database/models/RecipesModel';
import { recipes as routes } from './routes';
import verifyTokenMiddleware from '../middleware/verifyTokenMiddleware';
import { ErrorBadRequest } from '../../helpers/error/ApplicationError';
import { 
    recipeInsertFormValidation, 
    recipeInsertFormValidationRules 
} from '../middleware/recipeInsertFormValidationMiddleware';
import { 
    recipeUpdateFormValidation, 
    recipeUpdateFormValidationRules 
} from '../middleware/recipeUpdateFormValidationMiddleware';

const router = express.Router();

/*
    Requests involving a recipe's ingredients are used by the recipe's author
    to make changes to the ingredient data of a recipe.

    A recipe is requested, in every case, by using the recipe id provided in the request 
    url and an account id which is available in the request.
*/


/* Retrieves all recipes */
router.get(routes.find, verifyTokenMiddleware, catchAsync(async (req, res) => {
    const recipes = await Recipes.find({ 
        authoredBy: req.accountId 
    });

    return res.status(200).json({ 
        recipes: recipes 
    });
}));

/* Retrieves a specific recipe */
router.get(routes.findOne, verifyTokenMiddleware, catchAsync(async (req, res) => {
    const recipe = await Recipes.findOne({
        _id: req.params.recipeId,
        authoredBy: req.accountId 
    });

    return res.status(200).json({ 
        recipe: recipe 
    });
}));

/* Create and insert a new recipe */
router.post(
    routes.insert, 
    verifyTokenMiddleware,
    recipeInsertFormValidationRules(),
    recipeInsertFormValidation,
    catchAsync(async (req, res, next) => {
    
    const createdRecipe = new Recipes({
        title: req.body.title,
        authoredBy: req.accountId,
        ingredients: req.body.ingredients
    });

    await createdRecipe.save();

    if (!createdRecipe._id) {
        return next(new Error('Oops! Something went wrong'));
    }

    return res.status(200).json({ 
        recipeId: createdRecipe._id 
    });
}));

/*
    Update an existing recipe

    Recipe properties which can be updated should be restricted to: title
 */
router.put(
    routes.update, 
    verifyTokenMiddleware, 
    recipeUpdateFormValidationRules(),
    recipeUpdateFormValidation,
    catchAsync(async (req, res, next) => {

    const result = await Recipes.updateOne({
        _id: req.params.recipeId,
        authoredBy: req.accountId
    }, {
        title: req.body.title
    });

    if (result.ok < 1 || result.nModified < 1) {
        return next(new ErrorBadRequest());
    }

    return res.status(200).send();
}));

/* Delete a recipe */
router.delete(routes.remove, verifyTokenMiddleware, catchAsync(async (req, res, next) => {
    const result = await Recipes.deleteOne({
        _id: req.params.recipeId, 
        authroedBy: req.accountId
    });

    if (!result) {
        return next(new Error('Oops! Something went wrong.'));
    }

    return res.status(200).send();
}));

export default router;