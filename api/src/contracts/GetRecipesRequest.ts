import { RecipeCategories } from '../models/Recipe';

export interface GetRecipesRequest {
    searchKeyword: string;
    category: RecipeCategories;
}