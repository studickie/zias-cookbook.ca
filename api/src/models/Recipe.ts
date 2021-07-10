import { RecipeIngredient } from './RecipeIngredient';
import { RecipeIngredientGroup } from './RecipeIngredientGroup';

export enum RecipeCategories {
    breakfast,
    lunch,
    dinner,
    appetizer,
    dessert,
    snack,
    drink
}

export interface Recipe {
    createdOn: Date,
    lastUpdated: Date,
    title: string;
    authoredBy: string;
    ingredientGroups: RecipeIngredientGroup[],
    ingredients: RecipeIngredient[],
    directions: string[],
    categories: RecipeCategories[]
}