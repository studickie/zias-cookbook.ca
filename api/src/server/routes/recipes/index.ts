const recipesBase = `/recipes`;

export const recipes = {
    get: `${recipesBase}`,
    getById: `${recipesBase}/:recipeId`,
    post: `${recipesBase}`,
    put: `${recipesBase}/:recipeId`,
    delete: `${recipesBase}/:recipeId`
}

const instructionsBase = `${recipesBase}/:recipeId/instructions`;

export const instructions = {
    get: `${instructionsBase}`,
    getById: `${instructionsBase}/:ingredientId`,
    post: `${instructionsBase}`,
    put: `${instructionsBase}/:ingredientId`,
    delete: `${instructionsBase}/:ingredientId`,
}