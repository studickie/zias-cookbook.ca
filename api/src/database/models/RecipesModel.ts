import mongoose, { Schema, Document, Model, Types } from 'mongoose';

interface RecipeIngredient {
    item: string;
    measurement: number;
    measuringUnit: string;
}

export interface RecipeIngredientDocument extends Document, RecipeIngredient { }

const IngredientSchema = new Schema<RecipeIngredientDocument>({
    measurement: Number,
    measuringUnit: String,
    item: {
        type: String,
        required: [true, 'Provide an item name for the ingredient']
    }
});

interface Recipe {
    createdOn: Date,
    lastUpdated: Date,
    title: string;
    authoredBy: string;
    ingredients: RecipeIngredient[]
}

interface RecipeDocument extends Document, Recipe { 
    /*
        Re-declare the typing of the ingredients property to allow access to the methods included
        in the the object returned by a mongoose query; the "document" type of the sub-document.

        Without this step: mongoose-included searches on sub-documents (e.g.: .id()) are not recogonized
        by TypeScript.
    */
    ingredients: Types.DocumentArray<RecipeIngredientDocument>
}

const RecipeSchema = new Schema<RecipeDocument, Model<RecipeDocument>>({
    createdOn: Date,
    lastUpdated: Date,
    title: {
        type: String,
        required: [true, 'Provide a title for the recipe']
    },
    authoredBy: { 
        type: Schema.Types.ObjectId,
        ref: 'Accounts',
        required: [true, 'Assign an author to the recipe']
    },
    ingredients: [IngredientSchema]
});

/**
 * Schema on-save middleware sets createdOn and lastUpdated document properties to current date
 */
RecipeSchema.pre('save', function(next) {
    const currentDate = new Date();
    
    this.set({
        lastUpdated: currentDate,
        createdOn: (this.isNew) ? currentDate : this.createdOn
    });

    return next();
});

/**
 * Schema on-updateOne middleware sets lastUpated document property to current date
 */
RecipeSchema.pre('updateOne', function(next) {
    this.set({ 
        lastUpdated: new Date()
    });

    return next();
});

export default mongoose.model('Recipes', RecipeSchema);