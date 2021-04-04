import React from 'react';
import { useLocation } from 'react-router-dom';
import { requestToken } from '../../asyncHelpers/oauthAsync';

function OauthCallbackPage (): JSX.Element {
    const location = useLocation();

    React.useEffect(() => {
        async function request (code: string) {
            try {
                const response = await requestToken(code);

                console.log('response', response);

            } catch (e) {
                console.log('error', e);
            }
        }
        
        const code = location.search.match(/code=([^&]+)/);
        
        if (code && code[1]) request(decodeURIComponent(code[1]));

    }, []);

    return (
        <div>
            <h2>Google Auth Return</h2>
        </div>
    );
}

export default OauthCallbackPage;