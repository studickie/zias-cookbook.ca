import express from 'express';
import { ingredients as routes } from './routes';
import catchAsync from '../helpers/catchAsync';
import Recipes from '../../database/mongooseModels/RecipesModel';
import { ErrorNotFound } from '../../helpers/ApplicationError';
import verifyTokenMiddleware from '../middleware/verifyTokenMiddleware';
import {
    ingredientInsertFormValidation,
    ingredientInsertFormValidationRules
} from '../middleware/ingredientInsertFormValidationMiddleware';
import {
    ingredientUpdateFormValidation,
    ingredientUpdateFormValidationRules
} from '../middleware/ingredientUpdateFormValidationMiddleware';
import { RecipeIngredientDocument } from '../../database/mongooseModels/RecipesModel';

const router = express.Router();

/*
    Requests involving a recipe's ingredients are used by the recipe's author
    to make changes to the ingredient data of a recipe.

    A recipe is requested, in every case, by using the recipe id (and in the case
    of ingredient-specific operations: the ingredient id) provided in the request 
    url and the account's id which is added to the request by middleware.
*/

router.get(routes.find, verifyTokenMiddleware, catchAsync(async (req, res, next) => {

    const recipe = await Recipes.findOne({
        _id: req.params.recipeId,
        authoredBy: req.accountId
    });

    if (!recipe) { 
        return next(new ErrorNotFound());
    }

    return res.status(200).json({
        ingredients: recipe.ingredients
    });
}));

router.get(routes.findOne, verifyTokenMiddleware, catchAsync(async (req, res, next) => {

    const recipe = await Recipes.findOne({
        _id: `${req.params.recipeId}`,
        authoredBy: req.accountId
    });

    if (!recipe) { 
        return next(new ErrorNotFound());
    }

    const ingredient = recipe.ingredients.id(`${req.params.ingredientId}`);

    if (!ingredient) { 
        return next(new ErrorNotFound());
    }

    return res.status(200).json({ 
        ingredient: ingredient 
    });
}));

router.post(
    routes.insert, 
    verifyTokenMiddleware,
    ingredientInsertFormValidationRules(), 
    ingredientInsertFormValidation,
    catchAsync(async (req, res, next) => {
    
    const recipe = await Recipes.findOne({
        _id: `${req.params.recipeId}`,
        authoredBy: req.accountId
    });

    if (!recipe) { 
        return next(new ErrorNotFound());
    }

    const { groupId, label, value, unit } = req.body;
    
    recipe.ingredients.push({ groupId, label, value, unit });
    
    await recipe.save();

    return res.status(200).send();
}));

router.put(
    routes.update, 
    verifyTokenMiddleware,
    ingredientUpdateFormValidationRules(),
    ingredientUpdateFormValidation ,
    catchAsync(async (req, res, next) => {

    const recipe = await Recipes.findOne({
        _id: `${req.params.recipeId}`,
        authoredBy: req.accountId
    });

    if (!recipe) { 
        return next(new ErrorNotFound());
    }

    const ingredient = recipe.ingredients.id(`${req.params.ingredientId}`);

    if (!ingredient) {
        return next(new ErrorNotFound());
    }

    for (const key in ingredient) {
        if (Reflect.get(req.body, key)) {
            (ingredient[(key as keyof RecipeIngredientDocument)] as string) = req.body[key];
        }
    }

    await recipe.save();

    return res.status(200).send();
}));

router.delete(
    routes.remove, 
    verifyTokenMiddleware, 
    catchAsync(async (req, res, next) => {
    
    const recipe = await Recipes.findOne({
        _id: req.params.recipeId,
        authoredBy: req.accountId
    });

    if (!recipe) { 
        return next(new ErrorNotFound());
    }

    recipe.ingredients.id(`${req.params.ingredientId}`)?.remove();

    await recipe.save();

    return res.status(200).send();
}));

export default router;