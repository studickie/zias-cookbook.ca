import { RecipeCategories } from '../models/Recipe';
import { RecipeIngredient } from '../models/RecipeIngredient';
import { RecipeIngredientGroup } from '../models/RecipeIngredientGroup';

export interface UpdateRecipeRequest {
    title: string;
    ingredients: RecipeIngredient[];
    ingredientGroups: RecipeIngredientGroup[];
    directions: string[];
    categories: RecipeCategories[];
}