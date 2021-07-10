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
import { GetRecipesResponse } from '../../contracts/GetRecipesResponse';
//import { GetRecipeResponse } from '../../contracts/GetRecipeResponse';
import { CreateRecipeRequest } from '../../contracts/CreateRecipeRequest';
import { CreateRecipeResponse } from '../../contracts/CreateRecipeResponse';
import { UpdateRecipeRequest } from '../../contracts/UpdateRecipeRequest';

const router = express.Router();
router.use(verifyTokenMiddleware);

router.get(routes.find, catchAsync(async (req, res) => {
    // TODO: add form validation for search params
    const recipes = await Recipes.search(req.accountId, req.body);

    const responseBody: GetRecipesResponse = {
        recipes: recipes
    };

    return res.status(200).json(responseBody);
}));

router.get(routes.findOne, catchAsync(async (req, res) => {

    const recipe = await Recipes.findOne({
        _id: req.params.recipeId,
        authoredBy: req.accountId
    });

    // const responseBody: GetRecipeResponse = {
    //     recipe: recipe
    // };

    return res.status(200).json({recipe});
}));

router.post(
    routes.insert,
    recipeInsertFormValidationRules(),
    recipeInsertFormValidation,
    catchAsync(async (req, res, next) => {

        const {
            title,
            categories,
            ingredientGroups,
            ingredients,
            directions
        }: CreateRecipeRequest = req.body;

        const createdRecipe = new Recipes({
            title: title,
            authoredBy: req.accountId,
            categories: [...categories],
            ingredientGroups: ingredientGroups.map(grp => ({
                label: grp.label,
                groupId: grp.groupId
            })),
            ingredients: ingredients.map(itm => ({
                groupId: itm.groupId,
                label: itm.label,
                unit: itm.unit,
                value: itm.value
            })),
            directions: [...directions]
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

router.put(
    routes.update,
    recipeUpdateFormValidationRules(),
    recipeUpdateFormValidation,
    catchAsync(async (req, res, next) => {

        const {
            title,
            categories,
            ingredientGroups,
            ingredients,
            directions
        }: UpdateRecipeRequest = req.body;

        const result = await Recipes.updateOne({
            _id: req.params.recipeId,
            authoredBy: req.accountId
        },{
            title: title,
            categories: [...categories],
            ingredientGroups: ingredientGroups.map(grp => ({
                label: grp.label,
                groupId: grp.groupId
            })),
            ingredients: ingredients.map(itm => ({
                groupId: itm.groupId,
                label: itm.label,
                unit: itm.unit,
                value: itm.value
            })),
            directions: [...directions]
        });
        
        if (result.ok < 1 || result.nModified < 1) {
            return next(new ErrorBadRequest());
        }

        return res.status(200).send();
    })
);

router.delete(routes.remove, catchAsync(async (req, res, next) => {

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