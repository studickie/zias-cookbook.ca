import { RecipeIngredient } from "../models/RecipeIngredient";
import { RecipeCategories } from "../models/Recipe";

export interface RecipeInstruction {
    title: string;
    ingredients: {
        title: string;
        list: RecipeIngredient[];
    };
}

export interface RecipeResponse {
    recipeId: string;
    title: string;
    categories: RecipeCategories[];
    ingredients: RecipeInstruction[];
    directions: string[];
}

export interface GetRecipeResponse {
     recipe: RecipeResponse;
}