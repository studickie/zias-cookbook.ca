import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { 
    RecipeInstruction, 
    RecipeIngredient, 
    RecipeIngredientGroup 
} from '../../entities/RecipeInstruction';

export interface RecipeIngredientDocument extends Document, RecipeIngredient { }

const ingredientSchema = new Schema<RecipeIngredientDocument>({
    groupId: Number,
    value: Number,
    unit: String,
    label: {
        type: String,
        required: [true, 'Ingredient label cannot be empty']
    }
}, {
    _id: false
});

export interface RecpieIngredientGroupDocument extends Document, RecipeIngredientGroup { }

const ingredientGroupSchema = new Schema<RecpieIngredientGroupDocument>({
    label: String,
    groupId: {
        type: Number,
        required: [true, 'Ingredient groups require an Id'],
        default: 0
    }
}, {
    _id: false
});

export interface RecipeInstructionDocument extends Document, RecipeInstruction {
    ingredients: Types.DocumentArray<RecipeIngredientDocument>;
    groups: Types.DocumentArray<RecpieIngredientGroupDocument>;
}

const recipeInstructionSchema = new Schema<RecipeInstructionDocument, Model<RecipeInstructionDocument>>({
    createdOn: Date,
    lastUpdated: Date,
    title: {
        type: String,
        required: [true, 'Instruction title cannot be empty']
    },
    directions: [String],
    ingredients: [ingredientSchema],
    groups: [ingredientGroupSchema],
    /* 
        Id's for Recipes that have included the instruction set as part of their document

        Not for use with Mongoose.js's "populate" feature
    */
    includedIn: [String],
    /*
        flag marking instruction set as being available for use in other documents
    */
    isIncludable: Boolean
});

export default mongoose.model('RecipeInstructions', recipeInstructionSchema);