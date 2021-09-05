const accountsBase = '/accounts';

const basicAuthBase = `${accountsBase}/auth`

export const basicAuth = {
    signup: `${basicAuthBase}/signup`,
    login: `${basicAuthBase}/login`,
    forgotpassword: `${basicAuthBase}/forgotpassword`,
    resetpassword: `${basicAuthBase}/resetpassword`
}