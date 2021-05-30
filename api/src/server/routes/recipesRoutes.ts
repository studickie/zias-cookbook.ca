import express from 'express';
import catchAsync from '../helpers/catchAsync';
import Recipes from '../../database/mongooseModels/RecipesModel';
import { recipes as routes } from './routes';
import { ErrorBadRequest } from '../../helpers/ApplicationError';
import verifyTokenMiddleware from '../middleware/verifyTokenMiddleware';
import {
    recipeInsertFormValidation,
    recipeInsertFormValidationRules
} from '../middleware/recipeInsertFormValidationMiddleware';
import {
    recipeUpdateFormValidation,
    recipeUpdateFormValidationRules
} from '../middleware/recipeUpdateFormValidationMiddleware';
import { GetRecipesResponse } from '../../entities/GetRecipesResponse';
import { GetRecipeResponse } from '../../entities/GetRecipeResponse';
import { CreateRecipeRequest } from '../../entities/CreateRecipeRequest';
import { CreateRecipeResponse } from '../../entities/CreateRecipeResponse';
//import { UpdateRecipeRequest } from '../../entities/UpdateRecipeRequest';

const router = express.Router();
/*
    Requests involving a recipe's ingredients are used by the recipe's author
    to make changes to the ingredient data of a recipe.

    A recipe is requested, in every case, by using the recipe id provided in the request 
    url and an account id which is available in the request.
*/

/* Retrieves all recipes */
router.get(routes.find, verifyTokenMiddleware, catchAsync(async (req, res) => {
    // TODO: add form validation for search params
    const recipes = await Recipes.search(req.accountId, req.body);

    const responseBody: GetRecipesResponse = {
        recipes: recipes
    };

    return res.status(200).json(responseBody);
}));

/* Retrieves a specific recipe */
router.get(routes.findOne, verifyTokenMiddleware, catchAsync(async (req, res) => {

    const recipe = await Recipes.findOne({
        _id: req.params.recipeId,
        authoredBy: req.accountId
    });

    const responseBody: GetRecipeResponse = {
        recipe: recipe
    };

    return res.status(200).json(responseBody);
}));

/* Create and insert a new recipe */
router.post(
    routes.insert,
    verifyTokenMiddleware,
    recipeInsertFormValidationRules(),
    recipeInsertFormValidation,
    catchAsync(async (req, res, next) => {

        const { title, ingredients, categories }: CreateRecipeRequest = req.body;

        const createdRecipe = new Recipes({
            title: title,
            authoredBy: req.accountId,
            ingredients: ingredients,
            categories: categories
        });

        await createdRecipe.save();

        if (!createdRecipe._id) {
            return next(new Error('Oops! Something went wrong'));
        }

        const responseBody: CreateRecipeResponse = {
            recipeId: createdRecipe._id
        };

        return res.status(200).json(responseBody);
    })
);

/* Update an existing recipe */
router.put(
    routes.update,
    verifyTokenMiddleware,
    recipeUpdateFormValidationRules(),
    recipeUpdateFormValidation,
    catchAsync(async (req, res, next) => {

        const result = await Recipes.updateOne({
            _id: req.params.recipeId,
            authoredBy: req.accountId
        }, req.body);
        
        if (result.ok < 1 || result.nModified < 1) {
            return next(new ErrorBadRequest());
        }

        return res.status(200).send();
    })
);

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