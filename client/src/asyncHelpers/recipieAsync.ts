const API_URL = process.env.REACT_APP_API_URL;
import { Recipie } from '../types/Recipie';

export async function requestAccountRecipies(): Promise<{
    recipies: Recipie[]
}> {
    const response = await fetch(`${API_URL}/accounts/recipies`);

    return await response.json();
}

export async function requestAccountRecipieById(recipieId: string): Promise<{
    recipie: Recipie
}> {
    const response = await fetch(`${API_URL}/accounts/recipies/${recipieId}`);

    return await response.json();
}

export async function requestCreateRecipie(data: unknown): Promise<{
    recipie: Recipie
}> {
    const jsonData = JSON.stringify(data);

    const response = await fetch(`${API_URL}/accounts/recipies`, {
        method: 'POST',
        body: jsonData,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function requestUpdateRecipie(recipieId: string, data: unknown): Promise<{
    recipie: Recipie
}> {
    const jsonData = JSON.stringify(data);

    const response = await fetch(`${API_URL}/accounts/recipies/${recipieId}`, {
        method: 'PUT',
        body: jsonData,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function requestRemoveRecipie(recipieId: string): Promise<unknown> {

    const response = await fetch(`${API_URL}/accounts/recipies/${recipieId}`, {
        method: 'DELETE'
    });

    return await response.json();
}