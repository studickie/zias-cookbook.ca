import mongoose, { Schema, Model, Document } from "mongoose";
import AccountToken, { AccountTokenType } from "../../entities/AccountToken";
import crypto from "crypto";
import jwt from "jsonwebtoken";

interface AccountTokenDocument extends Document, AccountToken { }

interface AccountTokenModel extends Model<AccountTokenDocument> {
    /**
     * insertCreateAccountPermission
     * 
     * @description
     * Inserts an account token to granting a user create account permissions
     * 
     * @returns a JWT containing info about the account token
     */
    insertCreateAccountPermission: (key: string) => Promise<string>;
    /**
     * verifyCreateAccountPermission
     * 
     * @description
     * Verifies that the user's create account permissions code is valid
     * 
     * @returns boolean as the result of the operation
     */
    verifyCreateAccountPermission: (token: string, key: string) => Promise<boolean>;
}

const accountTokenSchema = new Schema<AccountTokenDocument, AccountTokenModel>({
    dateCreated: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Number,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        enum: [0]
    }
    /*,
    accountEmail: {
        type: String,
        //required: true
    }
    */
});

accountTokenSchema.statics.insertCreateAccountPermission = async function (key: string): Promise<string> {
    const uniqueToken = crypto.randomBytes(16).toString('hex');
    const expires = new Date(Date.now() + 10 * (60 * 1000));

    const jwToken = jwt.sign({
        exp: Math.floor(expires.getTime() / 1000),
        jti: uniqueToken
    }, key);

    const document = new this({
        dateCreated: new Date(),
        expiresAt: expires,
        token: uniqueToken,
        type: AccountTokenType.createAccount
    });

    await document.save();

    return jwToken;
}

accountTokenSchema.statics.verifyCreateAccountPermission = async function (token: string, key: string): Promise<boolean> {
    if (!jwt.verify(token, key)) {
        return false;
    }

    const decoded = jwt.decode(token) as { jti: string };

    const result = await this.deleteOne({
        token: decoded.jti,
        expiresAt: {
            $gt: Date.now()
        }
    });

    return result.ok && result.deletedCount ? true : false;
}

export default mongoose.model('AccountTokens', accountTokenSchema);