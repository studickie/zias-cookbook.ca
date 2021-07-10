import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { Account, AccountActivityStatus, AccountAuthMethod, AccountEmailPermissions } from '../../models/Account';

/* 
    -------------------------------------------
    Account Google Oauth2 sub-document schema
*/

const accountOauth2GoogleSchema = new Schema({
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

const accountDefaultCredentialsSchema = new Schema({
    /*
        Password validation for database concerned only about it being filled/ not empty. 

        Cannot be concerned with password formatting; value should be hashed before it is added to a document.
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



interface AccountDocument extends Document, Account { 
    comparePassword: (comparative: string) => Promise<boolean>;
}

interface AccountModel extends Model<AccountDocument> {
    createWithDefaultCredentials: (args: {
        email: string;
        password: string;
    }) => Promise<AccountDocument | false>;
}

const accountSchema = new Schema<AccountDocument, AccountModel>({
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
    accountCredentials: accountDefaultCredentialsSchema,
    oauth2Google: accountOauth2GoogleSchema
});

/**
 * Compares user-provided string to stored password hash for sign-in process
 * @param comparative user-provided string to compare against the hashed password
 * @returns
 */
accountSchema.methods.comparePassword = async function(comparative: string): Promise<boolean> {
    try {
        /* 
            This method should not be used if the account's auth method does not use a 
            user-provided password.
        */
        if (this.authMethod !== AccountAuthMethod.default || this.accountCredentials === undefined) {
            return false;
        }

        return await bcrypt.compare(comparative, this.accountCredentials.password);

    } catch (e) {
        // TODO: log error
        return false;
    } 
};

 /**
  * Factory function for creating a new account document with default credentials
  * @param param0
  * @returns newly created document
  */
accountSchema.statics.createWithDefaultCredentials = async function (args: {
    email: string,
    password: string,
}): Promise<AccountDocument | false> {
    try {
        const currentDate = new Date();
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(args.password, salt);

        const newAccount = new this({  
            createdOn: currentDate,
            lastUpdatedOn: currentDate,
            authMethod: AccountAuthMethod.default,
            activityStatus: AccountActivityStatus.active,
            email: args.email,
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

export default mongoose.model('Accounts', accountSchema);