import React from 'react';
import Page from '../../components/Page/Page';
import { useHistory, useLocation } from 'react-router-dom';
import { requestToken } from '../../asyncHelpers/oauthAsync';
import { AuthContext } from '../../context/AuthContext';

function OauthCallbackPage (): JSX.Element {
    const location = useLocation();
    const history = useHistory();

    const { authDispatch } = React.useContext(AuthContext);

    React.useEffect(() => {
        async function request (code: string) {
            try {
                const { token } = await requestToken(code);

                authDispatch({ type: 'LOGIN', token });

                history.push('/accounts');

            } catch (e) {
                console.log('error', e);
            }
        }
        
        const code = location.search.match(/code=([^&]+)/);
        
        if (code && code[1]) request(code[1]);

    }, []);

    // TODO: add 'page status' - loading, error feedback components
    return (
        <Page>
            <h2>Google Auth Return</h2>
        </Page>
    );
}

export default OauthCallbackPage;