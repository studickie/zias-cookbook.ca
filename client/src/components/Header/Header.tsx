import React from 'react';
import { Link as RouterLink} from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import GoogleSignIn from '../GoogleSignin/GoogleSignin';

function Header(): JSX.Element {

    const { authState, authDispatch } = React.useContext(AuthContext);

    return (
        <header>
            <div>
                <h1>Zia's Cookbook</h1>
                <nav>
                    <ul>
                        <li>
                            <RouterLink to='/'>
                                Home
                            </RouterLink>
                        </li>
                            { authState.hasAuthenticated
                                    ? <React.Fragment>
                                        <li>
                                            <RouterLink to='/account'>
                                                Account
                                            </RouterLink>
                                        </li>
                                        <li>
                                            <button onClick={() => authDispatch({ type: 'LOGOUT' })}>
                                                Log out
                                            </button>
                                        </li>
                                    </React.Fragment>
                                    : <GoogleSignIn/>
                            }
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;