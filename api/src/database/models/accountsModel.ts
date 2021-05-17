import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

/* 
    -------------------------------------------
    Account Google Oauth2 sub-document schema
*/

interface AccountOauth2Google {
    googleId: string;
    googleToken: string;
    googleRef?: string;
}

const AccountOauth2GoogleSchema = new Schema({
    googleId: {
        type: String,
        required: [true, 'Required field "googleId" not provided.'],
        min: [1, '"googleId" does not meet the minimum character length requirement.']
    },
    googleToken: {
        type: String,
        required: [true, 'Required field "googleToken" not provided.'],
        min: [1, '"googleToken" does not meet the minimum character length requirement.']
    },
    googleRef: {
        type: String,
        required: false
    }
}, {
    _id: false
});

/* 
    ---------------------------------------------------
    Account default credentials sub-document schema
*/

interface AccountDefaultCredentials {
    password: string;
}

const AccountDefaultCredentialsSchema = new Schema({
    /*
        Password validation for database concerned only about it being filled/ not empty. 

        Cannot be concerned with password formatting (checked in express middleware) because
        the value should be hashed before it is added to a document.
    */
    password: {
        type: String,
        required: [true, 'Required field "password" not provided.'],
        min: 1
    }
}, {
    _id: false
});

/* 
    -------------------------------------------
    Account Model primary document schema
*/

enum AccountEmailPermissions {
    true = 0,
    false = 1
}

enum AccountAuthMethod {
    default = 0,
    google = 1
}

enum AccountActivityStatus {
    active = 0,
    unverified = 1,
    deactivated = 2
}

export interface Account {
    createdOn: Date;
    lastUpdatedOn: Date;
    authMethod: AccountAuthMethod;
    activityStatus: AccountActivityStatus;
    email: string;
    emailSendPermission: AccountEmailPermissions;
    accountCredentials?: AccountDefaultCredentials,
    oauth2Google?: AccountOauth2Google;
}

/*
    Defines Account object with mongoose document properties (ex: _id), schema 
    methods and virtuals; Mongoose objects returned by a query
 */
interface AccountDocument extends Document, Account { 
    comparePassword: (comparative: string) => Promise<boolean>;
}

const AccountSchema = new Schema<AccountDocument, AccountModel>({
    createdOn: Date,
    lastUpdatedOn: Date,
    authMethod: {
        type: Number,
        enum: [0, 1]
    },
    activityStatus: {
        type: Number,
        enum: [0, 1, 2]
    },
    email: {
        type: String,
        required: [true, '"email" not provided.'],
        min: [1, '"email" does not mee the minimum character length requirement.']
    },
    emailSendPermission: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    accountCredentials: AccountDefaultCredentialsSchema,
    oauth2Google: AccountOauth2GoogleSchema
});

/**
 * 
 * @param comparative user-provided value to compare against the hashed password
 * @returns 
 */
AccountSchema.methods.comparePassword = async function(comparative: string): Promise<boolean> {
    try {
        /* 
            This method should not be used if the account's auth method does not use a user-provided password.

            Schema validation for password on 'default' auth method means the type-cast below can be done with 
            more confidence: if auth method is default, password is required on the model and should not be undefined.
        */
        if (this.authMethod !== AccountAuthMethod.default) {
            return false;
        }

        const result = await bcrypt.compare(comparative, (this.accountCredentials?.password as string));

        return result ? true : false;

    } catch (e) {
        // TODO: log error
        return false;
    } 
};

/*
    Defines Account mongoose model with static methods
*/
export interface AccountModel extends Model<AccountDocument> {
    createWithDefaultCredentials: (args: Pick<Account, 'email'> & Pick<AccountDefaultCredentials, 'password'>) => Promise<AccountDocument | false>;
    //createWithGoogleCredentials: (args: Pick<Account, 'email'> & AccountOauth2Google) => Promise<AccountModel>;
}

 /**
  * Factory function for creating a new account document with default credentials
  * @param param0
  * @returns If document creation completed without error the newly created document is returned, otherwise return false
  */
AccountSchema.statics.createWithDefaultCredentials = async function ({ 
    email, 
    password
}: Pick<Account, 'email'> & Pick<AccountDefaultCredentials, 'password'>
): Promise<AccountDocument | false> {
    try {
        const currentDate = new Date();

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newAccount = new this({  
            createdOn: currentDate,
            lastUpdatedOn: currentDate,
            authMethod: AccountAuthMethod.default,
            activityStatus: AccountActivityStatus.active,
            email: email,
            emailSendPermission: AccountEmailPermissions.true,
            accountCredentials: {
                password: hash
            }
        });

        const result = await newAccount.save();

        return result;

    } catch (e) {
        // TODO: log error

        return false;
    }
}

export default mongoose.model('Accounts', AccountSchema);