import { RecipeIngredient } from './RecipeIngredient';

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
    ingredients: RecipeIngredient[],
    categories: RecipeCategories[]
}