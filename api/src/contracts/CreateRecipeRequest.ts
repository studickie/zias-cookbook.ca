import { RecipeCategories } from '../models/Recipe';
import { RecipeIngredient } from '../models/RecipeIngredient';

export interface CreateRecipeRequest {
    title: string;
    ingredients: RecipeIngredient[];
    categories: RecipeCategories;
}