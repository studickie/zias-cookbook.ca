import React from 'react';
import Page from '../../components/Page/Page';
import RecipeForm from '../../components/RecipeForm/RecipeForm';

function RecipePage (): JSX.Element {
    return (
        <Page>
            <h2>Recipie Page</h2>
            <div>
                <RecipeForm/>
            </div>
        </Page>
    );
}

export default RecipePage;