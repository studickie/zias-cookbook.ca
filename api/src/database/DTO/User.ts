export interface DbUser {
    _id: string;
    googleId: string | null | undefined;
    googleToken: string | null | undefined;
    googleRef: string | null | undefined;
    createdOn: Date;
    updatedOn: Date;
}

export type DbUserAuthCredentials = Pick<DbUser, 'googleId' | 'googleToken' | 'googleRef'>;

export default class User {

    public static create (args: DbUserAuthCredentials): Omit<DbUser, '_id'> {
        const currentDate = new Date();

        return {
            googleId: args.googleId,
            googleRef: args.googleRef,
            googleToken: args.googleToken,
            createdOn: currentDate,
            updatedOn: currentDate
        }
    }
}