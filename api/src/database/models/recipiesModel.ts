import mongoose from 'mongoose';
import recipieSchema from '../schemas/recipieSchema';

export default mongoose.model('Recipies', recipieSchema);