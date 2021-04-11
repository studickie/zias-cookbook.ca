import React from 'react';
import { Switch, Route, Link as RouterLink } from 'react-router-dom';
import OauthCallbackPage from './pages/OauthCallbackPage/OauthCallbackPage';
import GoogleSignIn from './components/GoogleSignin/GoogleSignin';

function App(): JSX.Element {

	const handleCheckSession = async () => {
		try {
			fetch(`${process.env.REACT_APP_API_URL}`, {
				method: 'GET',
				credentials: 'include'
			})
			.then(res => res.json())
			.then(data => console.log('return', data));

		} catch (e) {
			console.log('[ERROR] - handleCheckSession: ', e);
		}
	}


	return (
		<div>
			<header>
				<h1>Zia's Cookbook</h1>
				<GoogleSignIn />
			</header>
			<ul>
				<li>
					<RouterLink to='/'>Home</RouterLink>
				</li>
				<li>
					<RouterLink to='/login/google_callback'>Oauth</RouterLink>
				</li>
			</ul>
			<div>
				<button onClick={handleCheckSession}>
					session check
				</button>
			</div>
			<div>
				<Switch>
					<Route exact path='/'>
						<h2>Home</h2>
					</Route>
					<Route path='/login/google_callback'>
						<OauthCallbackPage />
					</Route>
				</Switch>
			</div>
		</div>
	);
}

export default App;