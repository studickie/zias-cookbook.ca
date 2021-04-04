import * as React from 'react';
//import { requestGoogleSignin } from '../asyncHelpers/oauthAsync';
import { useAuthState, useAuthDispatch } from '../context/AuthContext';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function useGoogleOAuth(): void {
    const authState = useAuthState();

    const handleAuthChange = (googleUser: gapi.auth2.GoogleUser): void => {
        const isSignedIn = googleUser.isSignedIn();

        if (isSignedIn && !authState.hasAuthenticated) {
            requestSignIn(googleUser);
        }
    }

    const requestSignIn = async (googleUser: gapi.auth2.GoogleUser): Promise<void> => {
        try {
            const authResponse = googleUser.getAuthResponse(true).id_token;
            console.log('authResponse', authResponse);
            //const response = requestGoogleSignin(authResponse);

            //console.log('server response', response);
            
        } catch (e) {
            console.log('Error - requestSignIn', e);
        }
    }

    React.useEffect(() => {
        const config: gapi.auth2.ClientConfig = {
            client_id: clientId,
            cookie_policy: '',
            scope: '',
            fetch_basic_profile: true,
            ux_mode: 'popup',
            redirect_uri: ''
        }

        window.gapi.load('auth2', (): void => {
            window.gapi.auth2.init(config)
                .then(auth2 => {
                    const googleUser = auth2.currentUser.get();
                    auth2.currentUser.listen(handleAuthChange);

                    if (googleUser.isSignedIn()) {
                        requestSignIn(googleUser);
                    } else {
                        gapi.signin2.render('g-signin2', {});
                    }
                });
        });
    }, []);
}