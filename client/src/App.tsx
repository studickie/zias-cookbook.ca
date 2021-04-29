import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainPage from './pages/MainPage/MainPage';
import AccountPage from './pages/AccountPage/AccountPage';
import RecipiePage from './pages/RecipiePage/RecipiePage';
import ProtectedRoute from './routes/ProtectedRoute';
import OauthCallbackPage from './pages/OauthCallbackPage/OauthCallbackPage';

function App(): JSX.Element {
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