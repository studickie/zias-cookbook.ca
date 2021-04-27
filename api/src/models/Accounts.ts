import { ISchemaValidation } from '../helpers/schemaValidation';

export interface Account {
    googleId: string;
    googleToken: string;
    googleRef?: string;
}

export default class Accounts {
    private _validate: ISchemaValidation;

    constructor(validationLoader: ISchemaValidation) {
        this._validate = validationLoader;
    }

    public create(arg: Account): unknown {
        const account: Account = {
            googleId: arg.googleId,
            googleToken: arg.googleToken,
            googleRef: arg.googleRef
        };

        const validSchema = this._validate(account);

        if (validSchema !== null) {
            // TODO: log error
            // TODO: return falsy value

            console.log
        }

        return account;
    }
}