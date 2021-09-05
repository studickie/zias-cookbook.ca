import { RecipeCategories } from '../entities/Recipe';
import { RecipeIngredient } from '../entities/RecipeIngredient';

export interface RecipeResponse {
    recipeId: string;
    title: string;
    categories: RecipeCategories[];
    ingredients: RecipeIngredientResponse[];
    directions: string[];
}

export interface RecipeIngredientResponse {
    groupId: number;
    label: string;
    list: Pick<RecipeIngredient, 'label' | 'unit' | 'value'>[];
}