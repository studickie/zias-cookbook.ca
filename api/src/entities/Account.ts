export interface AccountGoogleTokens {
    access: string;
    refresh?: string | undefined | null;
}

export enum AccountRoles {
    super = 0,
    user
}

export enum AccountAuthTypes {
    basic = 0,
    oauth2Google
}

export enum AccountGoogleScopes {
    basic = 0
}

export default interface Account {
    dateCreated: Date;
    lastUpdated: Date;
    role: AccountRoles;
    email: string;
    password?: string;
    authType: AccountAuthTypes,
    googleId?: string;
    googleTokens?: AccountGoogleTokens;
    googleScopes?: AccountGoogleScopes[];
    emailPermission: 0 | 1;
}