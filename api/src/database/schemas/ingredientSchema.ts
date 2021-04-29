import { Schema } from 'mongoose';

const ingredientSchema = new Schema();

ingredientSchema.add({
    measurement: Number,
    measuringUnit: String,
    item: {
        type: String,
        required: [true, 'An ingredient requires an item name']
    }
});

export default ingredientSchema;