import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { requestOauth2Verify } from '../../asyncHelpers/oauthAsync';
import Page from '../../components/Page/Page';

function OauthCallbackPage (): JSX.Element {
    const location = useLocation();
    const history = useHistory();

    const { authDispatch } = React.useContext(AuthContext);

    React.useEffect(() => {
        async function request (code: string) {
            try {
                const { token } = await requestOauth2Verify(code);

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