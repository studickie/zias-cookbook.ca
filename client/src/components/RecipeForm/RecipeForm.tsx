import React from 'react';
import { AuthContext } from '../../context/AuthContext';

import { requestCreateRecipe } from '../../asyncHelpers/recipeAsync';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IngredientControl from '../IngredientControl/IngredientControl';
import Recipie from '../../types/recipe.interface.ts';
import Ingredient from '../../types/ingredient.interface';

interface FormState { 
    recipie: Recipie,
    unsavedIngredient: Omit<Ingredient, 'id'> | null;
}

type FormReducerAction =
    | {
        type: 'MODIFY_RECIPIE_TITLE';
        field: keyof FormState;
        value: string;
    }
    | {
        type: 'ADD_INGREDIENT_FIELD';
    };

function formReducer(state: FormState, action: FormReducerAction): FormState {
    switch (action.type) {
        case 'MODIFY_RECIPIE_TITLE':
            return state;
        case 'ADD_INGREDIENT_FIELD':
            return state;
        default:
            return state;
    }
}

interface Props { 
    injectRecipie: Recipie;
}

function RecipieForm({ injectRecipie }: Props): JSX.Element {

    const { authState } = React.useContext(AuthContext);

    const [formState, formDispatch] = React.useReducer(formReducer, {
        recipie: {
            id: injectRecipie.id || '-1',
            title: injectRecipie.title || '',
            ingredients: [...injectRecipie.ingredients] || []
        },
        unsavedIngredient: null
    });

    const handleCreateIngredient = () => {
        formDispatch({ type: 'ADD_INGREDIENT_FIELD' });
    }

    const handleSubmitCreate = async () => {
        try {
            const response = await requestCreateRecipe((authState.token as string), {
                title: formState.title,
                ingredients: formState.ingredients
            });

            console.log('create response: ', response);

        } catch (e) {
            console.log('[ERROR] - createRecipie: ', e);
        }
    }

    return (
        <form>
            <TextField
                id='txt_title'
                label='Title'
                value={formState.title}
                onChange={(e) => formDispatch({ type: 'MODIFY_FIELD', field: 'title', value: e.target.value })}
            />
            {
                formState.ingredients.map(ing => <IngredientControl key={ing.item} config={ing}/>)
            }
            <Button variant='text' color='default' onClick={handleCreateIngredient}>
                Add ingredient
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleSubmitCreate}>
                Create recipie
            </Button>
        </form>
    );
}

export default RecipieForm;