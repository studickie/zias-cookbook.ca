import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/*
    TypeScript with Mongoose.js explained here:
    https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1
 */

// Recipie Ingredient Sub-document
export interface RecipeIngredient {
    item: string;
    measurement: number;
    meauringUnit: string;
}

interface RecipeIngredientBaseDocument extends Document, RecipeIngredient { }

export type RecipeIngredientDocument = RecipeIngredientBaseDocument;

const IngredientSchema = new Schema<RecipeIngredientDocument, Model<RecipeIngredientDocument>>();

IngredientSchema.add({
    measurement: Number,
    measuringUnit: String,
    item: {
        type: String,
        required: [true, 'Provide an item name for the ingredient']
    }
});


// Exported model
export interface Recipe {
    title: string;
    authoredBy: string;
    ingredients: RecipeIngredient[]
}

/*
    Defines Recipe object with mongoose document properties (ex: _id), schema 
    methods and virtuals; Mongoose objects returned by a query
 */
interface RecipeBaseDocument extends Document, Recipe { }

export type RecipeDocument = RecipeBaseDocument;

const RecipeSchema = new Schema<RecipeDocument, Model<RecipeDocument>>();

RecipeSchema.add({
    title: {
        type: String,
        required: [true, 'Provide a title for the recipe']
    },
    authoredBy: { 
        type: Types.ObjectId, 
        ref: 'Accounts' 
    },
    ingredients: [IngredientSchema]
});

export default mongoose.model('Recipes', RecipeSchema);