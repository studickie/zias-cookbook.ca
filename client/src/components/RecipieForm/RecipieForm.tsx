import React from 'react';
import { AuthContext } from '../../context/AuthContext';
import { RecipieIngredient } from '../../types/Recipie';
import { requestCreateRecipie } from '../../asyncHelpers/recipieAsync';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IngredientControl from '../IngredientControl/IngredientControl';

interface FormState {
    title: string;
    ingredients: RecipieIngredient[];
}

type FormReducerAction =
    | {
        type: 'MODIFY_FIELD';
        field: keyof FormState;
        value: string;
    }
    | {
        type: 'ADD_INGREDIENT_FIELD';
    };

function formReducer(state: FormState, action: FormReducerAction): FormState {
    switch (action.type) {
        case 'MODIFY_FIELD':
            return {
                ...state,
                ...{
                    [action.field]: action.value
                }
            };
        case 'ADD_INGREDIENT_FIELD':
            return {
                ...state,
                ...{
                    ingredients: [...state.ingredients, {
                        item: '',
                        measurement: 0,
                        measuringUnit: ''
                    }]
                }
            }
        default:
            return state;
    }
}

interface Props { }

function RecipieForm({ }: Props): JSX.Element {

    const { authState } = React.useContext(AuthContext);

    const [formState, formDispatch] = React.useReducer(formReducer, {
        title: '',
        ingredients: []
    });

    const handleCreateIngredient = () => {
        formDispatch({ type: 'ADD_INGREDIENT_FIELD' });
    }

    const handleSubmitCreate = async () => {
        try {
            const response = await requestCreateRecipie((authState.token as string), {
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