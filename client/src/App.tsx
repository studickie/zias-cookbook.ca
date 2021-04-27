import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import MainPage from './pages/MainPage/MainPage';
import AccountPage from './pages/AccountPage/AccountPage';
import ProtectedRoute from './routes/ProtectedRoute';
import OauthCallbackPage from './pages/OauthCallbackPage/OauthCallbackPage';

function App(): JSX.Element {

	const { authState } = React.useContext(AuthContext);

	return (
		<AuthProvider>
			<Switch>
				<Route exact path='/'>
					<MainPage />
				</Route>
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