import { RecipeCategories } from '../database/models/RecipesModel';

export interface UpdateRecipeRequest {
    title?: string;
    category?: RecipeCategories;
}