interface RecipieIngredient {
    measurement: string;
    measuringUnit: string;
    item: string;
}

interface RecipieIngredientGroup {
    title: string;
    ingredients: RecipieIngredient[];
}

interface RecipieDirection {
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