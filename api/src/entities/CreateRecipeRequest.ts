import { 
    RecipeCategories, 
    RecipeIngredient 
} from '../database/models/RecipesModel';

export interface CreateRecipeRequest {
    title: string;
    ingredients: RecipeIngredient[];
    category: RecipeCategories;
}