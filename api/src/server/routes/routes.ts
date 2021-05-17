const accountsBase = '/accounts';

export const accounts = {
}

export const auth = {
    // POST
    requestSignup: `${accountsBase}/auth/requestSignup`,
    // POST
    signup: `${accountsBase}/auth/signup`,
    // POST
    signin: `${accountsBase}/auth/signin`
}

export const oauth2 = {
    // GET
    googleUrl: `${accountsBase}/oauth2/google`,
    // POST
    googleVerify: `${accountsBase}/oauth2/google`
}

const recipesBase = `/recipes`;

export const recipes = {
    // GET
    find: `${recipesBase}`,
    // GET
    findOne: `${recipesBase}/:recipeId`,
    // POST
    insert: `${recipesBase}`,
    // PUT
    update: `${recipesBase}/:recipeId`,
    // DELETE
    remove: `${recipesBase}/:recipeId`
}

const ingredientsBase = `${recipesBase}/:recipeId/ingredients`;

export const ingredients = {
    // GET
    find: `${ingredientsBase}`,
    // GET
    findOne: `${ingredientsBase}/:ingredientId`,
    // POST
    insert: `${ingredientsBase}`,
    // PUT
    update: `${ingredientsBase}/:ingredientId`,
    // DELETE
    remove: `${ingredientsBase}/:ingredientId`,
}