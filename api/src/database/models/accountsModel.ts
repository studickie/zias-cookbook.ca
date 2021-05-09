import mongoose, { Schema, Document, Model } from 'mongoose';

/*
    TypeScript with Mongoose.js explained here:
    https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1
 */

export interface Account {
    googleId: string;
    googleToken: string;
    googleRef?: string;
}

/*
    Defines Account object with mongoose document properties (ex: _id), schema 
    methods and virtuals; Mongoose objects returned by a query
 */
interface AccountBaseDocument extends Document, Account { }

export type AccountDocument = AccountBaseDocument;

const AccountSchema = new Schema<AccountDocument, Model<AccountDocument>>();

AccountSchema.add({
    googleId: String,
    googleToken: String,
    googleRef: String
});

export default mongoose.model('Accounts', AccountSchema);