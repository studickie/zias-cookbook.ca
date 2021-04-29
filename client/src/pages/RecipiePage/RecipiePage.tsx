import React from 'react';
import Page from '../../components/Page/Page';
import RecipieForm from '../../components/RecipieForm/RecipieForm';

function RecipiePage (): JSX.Element {
    return (
        <Page>
            <h2>Recipie Page</h2>
            <div>
                <RecipieForm/>
            </div>
        </Page>
    );
}

export default RecipiePage;