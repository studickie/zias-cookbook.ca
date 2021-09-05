export interface RecipeIngredient {
    groupId: number;
    label: string;
    value: number;
    unit: string;
}

export interface RecipeIngredientGroup {
    groupId: number;
    title: string;
}

export interface RecipeInstruction {
    createdOn: Date;
    lastUpdated: Date;
    title: string;
    directions: string[];
    ingredients: RecipeIngredient[];
    groups: RecipeIngredientGroup[];
    includedIn: string[];
    isIncludable: boolean;
}