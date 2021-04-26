import schemaValidation, { ISchemaValidation } from './schemaValidation.ts';

export interface IAccount {
    googleId: string;
    googleToken: string;
    googleRef?: string;
}

class Accounts {
    private _schema: ISchemaValidation;

    constructor(validationLoader: ISchemaValidation) {
        this._schema = validationLoader;
    }

    public create(arg: IAccount): unknown {
        const account: IAccount = {
            googleId: arg.googleId,
            googleToken: arg.googleToken,
            googleRef: arg.googleRef
        };

        const validSchema = this._schema.validate(account);

        if (validSchema !== null) {
            // TODO: log error
            // TODO: return falsy value

            console.log
        } 

        return account;
    }
}

export default (): InstanceType<typeof Accounts> => {
    const validation = schemaValidation('account');

    return new Accounts(validation);
}