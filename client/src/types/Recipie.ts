export interface RecipieIngredient {
    measurement: number;
    measuringUnit: string;
    item: string;
}

interface RecipieIngredientGroup {
    title: string;
    ingredients: RecipieIngredient[];
}

export interface RecipieDirection {
    sort: number;
    description: string;
}

interface RecipieDirectionGroup {
    title: string;
    directions: RecipieDirection[];
}

export interface Recipie {
    title: string;
    ingredients: RecipieIngredientGroup[];
    directions: RecipieDirectionGroup[];
}