//import * as React from 'react';
import { requestUrl } from '../../asyncHelpers/oauthAsync';

function GoogleSignIn(): JSX.Element {

    const handleGoogleLogin = async () => {
        try {
            const {authUrl } = await requestUrl();

            window.location.assign(authUrl);

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