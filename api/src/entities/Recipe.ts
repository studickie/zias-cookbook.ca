export enum RecipeCategories {
    breakfast,
    lunch,
    dinner,
    appetizer,
    dessert,
    snack,
    drink
}

export interface Recipe {
    createdOn: Date;
    lastUpdate: Date;
    title: string;
    authoredBy: string;
    categories: RecipeCategories[];
    instructions: string[];
}