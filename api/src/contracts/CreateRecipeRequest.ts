import { RecipeCategories } from '../models/Recipe';
import { RecipeIngredient } from '../models/RecipeIngredient';
import { RecipeIngredientGroup } from '../models/RecipeIngredientGroup';

export interface CreateRecipeRequest {
    title: string;
    ingredients: RecipeIngredient[];
    ingredientGroups: RecipeIngredientGroup[];
    directions: string[];
    categories: RecipeCategories[];
}