import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { GetRecipesRequest } from '../../entities/GetRecipesRequest';

export interface RecipeIngredient {
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

export enum RecipeCategories {
    none = 0,
    breakfast = 1,
    lunch = 2,
    dinner = 3,
    dessert = 4,
    appetizer = 5,
    snack = 6
}

export interface Recipe {
    createdOn: Date,
    lastUpdated: Date,
    title: string;
    authoredBy: string;
    ingredients: RecipeIngredient[],
    category: RecipeCategories
}

interface RecipeDocument extends Document, Recipe { 
    /*
        Re-declare the typing of properties which are mongoose sub-documents to identify 
        returned types as mongoose document 
    */
    ingredients: Types.DocumentArray<RecipeIngredientDocument>
}

interface RecipeModel extends Model<RecipeDocument> {
    search: (accountId: string, filters: unknown) => Promise<RecipeDocument[]>;
}

const RecipeSchema = new Schema<RecipeDocument, RecipeModel>({
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
    ingredients: [IngredientSchema],
    category: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6]
    }
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

/**
 * 
 * @param accountId 
 * @param filters 
 */
RecipeSchema.statics.search = async function(accountId: string, filters: GetRecipesRequest): Promise<RecipeDocument[]> {
    let query = {
        authoredBy: accountId
    };

    if (filters.searchKeyword) {
        query = {
            ...query,
            ...{
                'ingredients.item': filters.searchKeyword
            }
        };
    }

    if (filters.category) {
        query = {
            ...query,
            ...{
                'category': filters.category
            }
        };
    }

    const result = await this.find(query);

    return result;
}

export default mongoose.model('Recipes', RecipeSchema);