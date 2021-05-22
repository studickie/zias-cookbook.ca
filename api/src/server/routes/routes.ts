const accountsBase = '/accounts';

export const accounts = { }

const authBase = `${accountsBase}/auth`

export const auth = {
    // POST
    requestSignup: `${authBase}/requestSignup`,
    // POST
    signup: `${authBase}/signup`,
    // POST
    signin: `${authBase}/signin`
}

const oauth2Base = `${accountsBase}/oauth2`;

export const oauth2 = {
    // GET
    googleUrl: `${oauth2Base}/google`,
    // POST
    googleVerify: `${oauth2Base}/google`
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