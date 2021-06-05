import Ingredient from './ingredient.interface';

export default interface Recipe {
    id: string;
    title: string;
    ingredients: Ingredient[];
}