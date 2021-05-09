import mongoose, { Schema, Document, Model } from 'mongoose';

/*
    TypeScript with Mongoose.js explained here:
    https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1
 */

export interface AccountToken {
    email: string;
}

/*
    Defines AccountTokenSchema object with mongoose document properties (ex: _id), schema 
    methods and virtuals; Mongoose objects returned by a query
 */
interface AccountTokenBaseDocument extends Document, AccountToken { }

export type AccountTokenDocument = AccountTokenBaseDocument;

/*
    Defines static methods written for an AccountTokenSchema mongoose model
 */

const AccountTokenSchema = new Schema<AccountTokenDocument, Model<AccountTokenDocument>>();

AccountTokenSchema.add({
    email: {
        type: String,
        required: [true, 'Email must not be empty']
    }
});

export default mongoose.model('AccountTOkens', AccountTokenSchema);