//import * as React from 'react';
import { requestUrl } from '../../asyncHelpers/oauthAsync';

function GoogleSignIn (): JSX.Element {
    
    const handleGoogleLogin = async () => {
        try {
            const response = await requestUrl();
            
            window.location.assign(response.auth_url);

        } catch (e) {
            console.log('error', e);
        }
    }

    return (
        <button onClick={handleGoogleLogin}>
            Sign In with Google
        </button>
    );
}

export default GoogleSignIn;