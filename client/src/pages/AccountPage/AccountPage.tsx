import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Page from '../../components/Page/Page';

function AccountPage (): JSX.Element {
    return (
        <Page>
            <h2>Account Page</h2>
            <ul>
                <li>
                    <RouterLink to='/accounts/recipies/create'>
                        Create Recipie
                    </RouterLink>
                </li>
            </ul>
        </Page>
    );
}

export default AccountPage;