import { Recipe } from "../models/Recipe";

export interface GetRecipeResponse {
    recipe: Recipe | null;
}