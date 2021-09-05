import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import Account, { 
    AccountAuthTypes, 
    AccountGoogleScopes, 
    AccountGoogleTokens, 
    AccountRoles 
} from "../../entities/Account";

export interface AccountDocument extends Document, Account {
    /**
     * comparePassword
     * 
     * @description
     * Document method which returns false if the document's auth type does not support
     * passwords or if the comparator argument does not match the document's password
     * 
     * @returns boolean as result of operation
     */
    comparePassword: (comparator: string | undefined) => Promise<boolean>;
}

export interface AccountModel extends Model<AccountDocument> {
    /**
     * insertWithBasicAuthStrategy
     * 
     * @description 
     * Model method whcih creates a new account with basic authentication configuration
     * 
     * @returns created account document
     */
    insertWithBasicAuthStrategy: (email: string, password: string, role: AccountRoles) => Promise<AccountDocument>;
    /**
     * insertWithGoogleOauth2Strategy
     * 
     * @description 
     * Model method which creates a new account with Google OAuth2 as authentication 
     * configuration
     * 
     * @returns created account document
     */
    insertWithGoogleOauth2Strategy: (
        email: string,
        role: AccountRoles,
        googleId: string,
        tokens: AccountGoogleTokens,
        scopes: AccountGoogleScopes[]
    ) => Promise<AccountDocument>;
}

const accountSchema = new Schema<AccountDocument, AccountModel>({
    dateCreated: Date,
    lastUpdated: Date,
    email: {
        type: String,
        required: [true, "An email is required"],
        min: 4
    },
    password: String,
    role: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    authType: {
        type: Number,
        enum: [0, 1],
        required: [true, "Missing Authentication type"]
    },
    googleId: String,
    googleTokens: new Schema({
        access: String,
        refresh: String
    }, {
        _id: false
    }),
    googleScopes: {
        type: [Number],
        enum: [0, 1],
        default: undefined
    },
    emailPermission: {
        type: Number,
        enum: [0, 1],
        default: 0
    }
});

/**
 * @description
 * On save, hash password if account password has been modified
 */
accountSchema.pre("save", async function (next) {
    if (this.password && (this.isNew || this.isModified(this.password))) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);

        this.password = hash;
    }

    return next();
});

/**
 * @description
 * On save, set document lastUpdated property to current date,
 * set dateCreated to current date if it document is new.
 */
accountSchema.pre("save", function (next) {

    const currentDate = new Date();
    this.lastUpdated = currentDate;

    if (this.isNew) {
        this.dateCreated = currentDate;
    }

    return next();
});

accountSchema.methods.comparePassword = async function (comparator: string): Promise<boolean> {

    if (this.authType === AccountAuthTypes.basic && this.password) {
        return await bcrypt.compare(comparator, this.password);
    }

    return false;
}

accountSchema.statics.insertWithBasicAuthStrategy = async function (
    email: string,
    password: string,
    role: AccountRoles
): Promise<AccountDocument> {

    const newAccount = new this({
        authType: AccountAuthTypes.basic,
        email,
        password,
        role
    });

    return await newAccount.save();
}

accountSchema.statics.insertWithGoogleOauth2Strategy = async function (
    email: string,
    role: AccountRoles,
    googleId: string,
    tokens: AccountGoogleTokens,
    scopes: AccountGoogleScopes[]
): Promise<AccountDocument> {

    const newAccount = new this({
        authType: AccountAuthTypes.oauth2Google,
        email: email,
        googleId: googleId,
        googleScopes: scopes,
        googleTokens: tokens,
        role: role
    });

    return await newAccount.save();
}

export default mongoose.model("Accounts", accountSchema);