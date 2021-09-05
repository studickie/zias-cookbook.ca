import { RecipeCategories } from '../entities/Recipe';

export interface GetRecipesRequest {
    searchKeywords: string[];
    categories: RecipeCategories[];
}