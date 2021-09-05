export enum AccountTokenType {
    createAccount = 0
}

export default interface AccountToken {
    dateCreated: Date;
    expiresAt: number;
    token: unknown;
    type: AccountTokenType;
    accountEmail: string;
}