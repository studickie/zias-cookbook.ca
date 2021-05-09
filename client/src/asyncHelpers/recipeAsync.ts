import Recipe from '../types/recipe.interface.ts';

const API_URL = process.env.REACT_APP_API_URL;

export async function requestAccountRecipies(): Promise<{
    recipies: Recipe[]
}> {
    const response = await fetch(`${API_URL}/accounts/recipies`);

    return await response.json();
}

export async function requestAccountRecipeById(recipeId: string): Promise<{
    recipe: Recipe
}> {
    const response = await fetch(`${API_URL}/accounts/recipies/${recipeId}`);

    return await response.json();
}

export async function requestCreateRecipe(jwt: string, data: Omit<Recipe, 'id'>): Promise<{
    recipe: Recipe
}> {
    const jsonData = JSON.stringify(data);

    const response = await fetch(`${API_URL}/accounts/recipies`, {
        method: 'POST',
        body: jsonData,
        headers: {
            'Authorization': jwt,
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function requestUpdateRecipe(recipeId: string, data: unknown): Promise<{
    recipe: Recipe
}> {
    const jsonData = JSON.stringify(data);

    const response = await fetch(`${API_URL}/accounts/recipies/${recipeId}`, {
        method: 'PUT',
        body: jsonData,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function requestRemoveRecipe(recipeId: string): Promise<unknown> {

    const response = await fetch(`${API_URL}/accounts/recipies/${recipeId}`, {
        method: 'DELETE'
    });

    return await response.json();
}