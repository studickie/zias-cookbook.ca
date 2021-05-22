import mongoose, { Schema, Document, Model, Types } from 'mongoose';

interface RecipeIngredient {
    item: string;
    measurement: number;
    measuringUnit: string;
}

interface RecipeIngredientDocument extends Document, RecipeIngredient { }

const IngredientSchema = new Schema<RecipeIngredientDocument>({
    measurement: Number,
    measuringUnit: String,
    item: {
        type: String,
        required: [true, 'Provide an item name for the ingredient']
    }
});

enum RecipeStatus {
    active = 0,
    archived = 1
}

interface Recipe {
    createdOn: Date,
    lastUpdatedOn: Date,
    title: string;
    authoredBy: string;
    activeStatus: RecipeStatus;
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

interface RecipeModel extends Model<RecipeDocument> { 
    createRecipe: (recipe: Omit<Recipe, 'createdOn' | 'lastUpdatedOn' | 'activeStatus'>) => Promise<RecipeDocument | false>;
    archiveRecipe: (recipeId: string, accountId: string) => Promise<boolean>;
}

const RecipeSchema = new Schema<RecipeDocument, RecipeModel>({
    createdOn: Date,
    lastUpdatedOn: Date,
    title: {
        type: String,
        required: [true, 'Provide a title for the recipe']
    },
    authoredBy: { 
        type: Schema.Types.ObjectId,
        ref: 'Accounts',
        required: [true, 'Assign an author to the recipe']
    },
    activeStatus: {
        type: Number,
        enum: [0, 1]
    },
    ingredients: [IngredientSchema]
});

RecipeSchema.statics.archiveRecipe = async function(
    recipeId: string,
    accountId: string
): Promise<boolean> {
    try {
        const result = await this.updateOne({
            _id: recipeId,
            authoredBy: accountId
        }, {
            activeStatus: RecipeStatus.archived,
            updatedOn: new Date() 
        });

        return (result.ok && result.nModified > 0)
            ? true
            : false;

    } catch (e) {
        // TODO: log error

        return false;
    }
}

RecipeSchema.statics.createRecipe = async function(
    recipe: Omit<Recipe, 'createdOn' | 'lastUpdatedOn' | 'activeStatus'>
): Promise<RecipeDocument | false> {
    try {
        const currentDate = new Date();

        const recipeDoc = new this({
            createdOn: currentDate,
            lastUpdatedOn: currentDate,
            title: recipe.title,
            authoredBy: recipe.authoredBy,
            status: RecipeStatus.active,
            ingredients: recipe.ingredients
        });

        const result = recipeDoc.save();

        return result;

    } catch (e) {
        // TODO: log error
        return false;
    }
}

export default mongoose.model('Recipes', RecipeSchema);