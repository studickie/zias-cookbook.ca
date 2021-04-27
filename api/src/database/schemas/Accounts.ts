import mongoose, { Schema } from 'mongoose';

const accountSchema = new Schema({
    googleId: String,
    googleToken: String,
    googleRef: String
});

export default mongoose.model('Accounts', accountSchema);