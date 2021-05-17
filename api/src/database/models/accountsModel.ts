import mongoose, { Schema, Document, Model } from 'mongoose';

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
    password: {
        type: String,
        required: [true, 'Required field "password" not provided.'],
        min: [8, '"password" does not meet the minimum character length requirement.'],
        max: [16, '"password" exceeds the maximum character length.']
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
interface AccountDocument extends Document, Account { }

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

export interface AccountModel extends Model<AccountDocument> {
    createWithDefaultCredentials: (args: Pick<Account, 'email'> & Pick<AccountDefaultCredentials, 'password'>) => Promise<AccountModel>;
    createWithGoogleCredentials: (args: Pick<Account, 'email'> & AccountOauth2Google) => Promise<AccountModel>;
}

AccountSchema.statics.createWithDefaultCredentials = async function ({ 
    email, 
    password
}: Pick<Account, 'email'> & Pick<AccountDefaultCredentials, 'password'>
): Promise<AccountDocument> {
    const currentDate = new Date();

    return await this.create({  
        createdOn: currentDate,
        lastUpdatedOn: currentDate,
        authMethod: AccountAuthMethod.default,
        activityStatus: AccountActivityStatus.active,
        email: email,
        emailSendPermission: AccountEmailPermissions.true,
        accountCredentials: {
            password: password
        }
    });
}

export default mongoose.model('Accounts', AccountSchema);