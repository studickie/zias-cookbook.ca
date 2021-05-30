import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { Recipe } from '../../models/Recipe';
import { RecipeIngredient } from '../../models/RecipeIngredient';

export interface RecipeIngredientDocument extends Document, RecipeIngredient { }

const ingredientSchema = new Schema<RecipeIngredientDocument>({
    measurement: Number,
    measuringUnit: String,
    item: {
        type: String,
        required: [true, 'Provide an item name for the ingredient']
    }
});

interface RecipeDocument extends Document, Recipe {
    /*
        Re-declare the typing of properties which are mongoose sub-documents to identify 
        returned types as mongoose document 
    */
    ingredients: Types.DocumentArray<RecipeIngredientDocument>
}

interface RecipeModel extends Model<RecipeDocument> {
    search: (accountId: string, filters: Record<string, unknown>) => Promise<RecipeDocument[]>;
}

const recipeSchema = new Schema<RecipeDocument, RecipeModel>({
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
    ingredients: [ingredientSchema],
    categories: {
        type: [Number],
        enum: [0, 1, 2, 3, 4, 5, 6]
    }
});

/**
 * Schema on-save middleware sets createdOn and lastUpdated document properties to current date
 */
recipeSchema.pre('save', function (next) {
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
recipeSchema.pre('updateOne', function (next) {
    this.set({
        lastUpdated: new Date()
    });

    return next();
});

/**
 * Modal method for recipe search parameter parsing
 * @param accountId 
 * @param filters 
 */
recipeSchema.statics.search = async function (accountId: string, filters: Record<string, unknown>): Promise<RecipeDocument[]> {
    const query = Object.keys(filters).reduce((acc, key) => {
        const value = filters[(key as keyof typeof filters)];

        if (value === undefined) return acc;

        switch (key) {
            case 'searchKeyword':
                return (value !== undefined)
                    ? {
                        ...acc,
                        ...{
                            'ingredients.item': value
                        }
                    }
                    : acc;
            case 'categories':
                return (value !== undefined)
                    ? {
                        ...acc,
                        ...{
                            categories: {
                                $in: value
                            }
                        }
                    }
                    : acc;
            default:
                return acc;
        }
    }, {
        authoredBy: accountId
    });
    
    const result = await this.find(query);

    return result;
}

export default mongoose.model('Recipes', recipeSchema);