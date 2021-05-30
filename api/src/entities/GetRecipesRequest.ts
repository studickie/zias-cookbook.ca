import { RecipeCategories } from '../database/models/RecipesModel';

export interface GetRecipesRequest {
    searchKeyword: string;
    category: RecipeCategories;
}