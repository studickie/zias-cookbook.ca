import mongoose, { Schema } from 'mongoose';

const accountSchema = new Schema();

accountSchema.add({
    googleId: String,
    googleToken: String,
    googleRef: String
});

export default mongoose.model('Accounts', accountSchema);