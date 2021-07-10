import mongoose, { Schema } from 'mongoose';

export enum AccountCodeType {
    authValidation
}

const accountCodesSchema = new Schema({
    code: {
        type: String,
        required: [true, 'Required field "code" not provided']
    },
    codeType: {
        type: Number,
        enum: [0]
    },
    accountEmail: {
        type: String,
        required: [true, 'Required field "accountEmail" not provided']
    },
    createdOn: Date,
    expiresAt: Date
});

export default mongoose.model('AccountCodes', accountCodesSchema);