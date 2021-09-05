import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { Recipe } from '../../entities/Recipe';

export interface RecipeDocument extends Document, Recipe { }

const recipeSchema = new Schema<RecipeDocument, Model<RecipeDocument>>({
    createdOn: Date,
    lastUpdated: Date,
    title: {
        type: String,
        required: [true, 'Recipe title cannot be empty']
    },
    authoredBy: {
        type: Types.ObjectId,
        required: [true, 'Recipe author cannot be empty']
    },
    categories: {
        type: [Number],
        enum: [0, 1, 2, 3, 4, 5, 6]
    },
    /*
        RecipeInstruction document id's which are used by the Recipe document

        Intended for use with Mongoose.js's "populate" feature
    */
    intructions: [{
        type: Types.ObjectId,
        ref: 'RecipeInstructions'
    }]
});

recipeSchema.pre('save', function (next) {
    const currentDate = new Date();

    this.set({
        lastUpdated: currentDate,
        createdOn: (this.isNew) ? currentDate : this.createdOn
    });

    return next();
});

recipeSchema.pre('updateOne', function (next) {
    this.set({
        lastUpdated: new Date()
    });

    return next();
});

export default mongoose.model('Recipes', recipeSchema);

/**
 * Modal method for recipe search parameter parsing
 * @param accountId 
 * @param filters 
 */
// recipeSchema.statics.search = async function (accountId: string, filters: Record<string, unknown>): Promise<RecipeDocument[]> {
//     const query = Object.keys(filters).reduce((acc, key) => {
//         const value = filters[(key as keyof typeof filters)];

//         if (value === undefined) return acc;

//         switch (key) {
//             case 'searchKeywords':
//                 return (value !== undefined)
//                     ? {
//                         ...acc,
//                         ...{
//                             'ingredients.item': {
//                                 $in: value
//                             }
//                         }
//                     }
//                     : acc;
//             case 'categories':
//                 return (value !== undefined)
//                     ? {
//                         ...acc,
//                         ...{
//                             categories: {
//                                 $in: value
//                             }
//                         }
//                     }
//                     : acc;
//             default:
//                 return acc;
//         }
//     }, {
//         authoredBy: accountId
//     });

//     const result = await this.find(query);

//     return result;
// }