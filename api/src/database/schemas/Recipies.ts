import mongoose, { Schema } from 'mongoose';

const recipieSchema = new Schema();

recipieSchema.add({
    title: String,
    authoredBy: String,
    subscribers: [String]
});

export default mongoose.model('Recipies', recipieSchema);