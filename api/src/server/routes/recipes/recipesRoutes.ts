import express from 'express';
import catchAsync from '../../helpers/catchAsync';
import Recipes from '../../../database/models/RecipesModel';
import { recipes as routes } from '.';
import { ErrorBadRequest, ErrorNotFound } from '../../../helpers/ApplicationError';
import verifyTokenMiddleware from '../../middleware/verifyTokenMiddleware';
import {
    recipeSearchFormValidation,
    recipeSearchFormValidationRules
 } from '../../middleware/recipeSearchFormValidationMiddleware';
import {
    recipeInsertFormValidation,
    recipeInsertFormValidationRules
} from '../../middleware/recipeInsertFormValidationMiddleware';
import {
    recipeUpdateFormValidation,
    recipeUpdateFormValidationRules
} from '../../middleware/recipeUpdateFormValidationMiddleware';
import { GetRecipesRequest } from '../../../contracts/GetRecipesRequest';
import { GetRecipesResponse } from '../../../contracts/GetRecipesResponse';
import { GetRecipeResponse } from '../../../contracts/GetRecipeResponse';
import { CreateRecipeRequest } from '../../../contracts/CreateRecipeRequest';
import { CreateRecipeResponse } from '../../../contracts/CreateRecipeResponse';
import { UpdateRecipeRequest } from '../../../contracts/UpdateRecipeRequest';
//import mapRecipeResponse from '../../../mapper/mapRecipeResponse';

const router = express.Router();    
router.use(verifyTokenMiddleware);

router.get(
    routes.get, 
    recipeSearchFormValidationRules(),
    recipeSearchFormValidation,
    catchAsync(async (req, res) => {

    // const {
    //     categories,
    //     searchKeywords
    // }: GetRecipesRequest = req.body; 

    // const recipes = await Recipes.search((req.accountId as string), {
    //     categories: categories,
    //     searchKeywords: searchKeywords
    // });

    // const responseBody: GetRecipesResponse = {
    //     recipes: recipes.map(rcp => mapRecipeResponse(rcp))
    // };

    return res.status(200).send();
}));

router.get(routes.getById, catchAsync(async (req, res) => {

    const recipe = await Recipes.findOne({
        _id: req.params.recipeId,
        authoredBy: req.accountId
    });

    if (!recipe) {
        throw new ErrorNotFound();
    }

    // const responseBody: GetRecipeResponse = {
    //     recipe: mapRecipeResponse(recipe)
    // };

    return res.status(200).json({ recipe });
}));

router.post(
    routes.post,
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
    routes.put,
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
        }, {
            $set: {
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
            }
        });
        
        if (!result.ok || !result.nModified) {
            return next(new ErrorBadRequest());
        }

        return res.status(200).send();
    })
);

router.delete(routes.delete, catchAsync(async (req, res, next) => {

    const result = await Recipes.deleteOne({
        _id: req.params.recipeId,
        authoredBy: req.accountId
    });

    if (!result.ok || !result.deletedCount) {
        return next(new ErrorBadRequest());
    }

    return res.status(200).send();
}));

export default router;