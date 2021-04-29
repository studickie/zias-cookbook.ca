import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainPage from './pages/MainPage/MainPage';
import AccountPage from './pages/AccountPage/AccountPage';
import RecipiePage from './pages/RecipiePage/RecipiePage';
import ProtectedRoute from './routes/ProtectedRoute';
import OauthCallbackPage from './pages/OauthCallbackPage/OauthCallbackPage';
import { requestOauth2Verify } from './asyncHelpers/oauthAsync';

function App(): JSX.Element {

	async function requestGoogleSignin(googleId: string): Promise<void> {
		try {
			const response = await requestOauth2Verify(googleId);

			console.log('response', response);
			
		} catch (e) {
			console.log('[ERROR] - requestGoogleSignin: ', e);
		}
	}

	function handleSuccess(googleUser: gapi.auth2.GoogleUser): void {
		const { id_token } = googleUser.getAuthResponse();

		//requestGoogleSignin(id_token);
	}

	function handleFailure(reason: unknown): void {
		console.log('failed to sign-in: ', reason);
	}

	React.useEffect(() => {
		// TODO: create & inject google script rather than hard-code (fix error where gapi.load is called before googleapis script it read)

		const clientConfig: gapi.auth2.ClientConfig = {
			client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
			cookie_policy: 'single_host_origin',
			scope: 'openid',
			ux_mode: 'popup'
		};

		gapi.load('auth2', () => {
			gapi.auth2.init(clientConfig)
			.then(googleAuth => {

				if (googleAuth.isSignedIn.get()) {
					const authResponse = googleAuth.currentUser.get().getAuthResponse();
					console.log('auth response', authResponse)
					//requestGoogleSignin(id_token);

				} else {
					// TODO: set auth state as false
					// TODO//: render sign-in button
					gapi.signin2.render('btn_google_oauth', {
						scope: 'openid',
						width: 200,
						height: 50,
						longtitle: true,
						theme: 'dark',
						onsuccess: handleSuccess,
						onfailure: handleFailure
					});
				}

				/*
					Listener is only fired when sign-in status has changed for a user who
					has previously given consent for Google to communicate with the app.
				*/
				googleAuth.currentUser.listen(gUser => {
					if (gUser.isSignedIn()) {
						// !: this will trigger the same process as the login handler in the sign-in button
						// !: if user has clicked sign-in how can the request triggered by this listener be ignored?
						const { id_token } = gUser.getAuthResponse();
						//requestGoogleSignin(id_token);

					} else {
						// TODO: remove auth state
					}
				});
				
			});
		})
    },[]);

	return (
		<AuthProvider>
			<Switch>
				<Route exact path='/'>
					<MainPage />
				</Route>
				<ProtectedRoute path='/accounts/recipies/create'>
					<RecipiePage />
				</ProtectedRoute>
				<ProtectedRoute path='/accounts'>
					<AccountPage />
				</ProtectedRoute>
				<Route path='/login/google_callback'>
					<OauthCallbackPage />
				</Route>
			</Switch>
		</AuthProvider>
	);
}

export default App;