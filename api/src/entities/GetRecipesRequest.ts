import { RecipeCategories } from '../database/mongooseModels/RecipesModel';

export interface GetRecipesRequest {
    searchKeyword: string;
    category: RecipeCategories;
}