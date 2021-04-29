import mongoose from 'mongoose';
import accountSchema from '../schemas/accountSchema';

export default mongoose.model('Accounts', accountSchema);