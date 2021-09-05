import { RecipeCategories } from '../entities/Recipe';
import { RecipeIngredient } from '../entities/RecipeIngredient';
import { RecipeIngredientGroup } from '../entities/RecipeIngredientGroup';

export interface CreateRecipeRequest {
    title: string;
    ingredients: RecipeIngredient[];
    ingredientGroups: RecipeIngredientGroup[];
    directions: string[];
    categories: RecipeCategories[];
}