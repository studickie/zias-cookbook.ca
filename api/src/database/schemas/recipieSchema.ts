import { Schema } from 'mongoose';
import ingredientSchema from './ingredientSchema';

const recipieSchema = new Schema();

recipieSchema.add({
    title: String,
    authoredBy: String,
    subscribers: [String],
    ingredients: [ingredientSchema]
});

export default recipieSchema;