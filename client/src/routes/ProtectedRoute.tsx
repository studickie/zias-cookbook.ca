import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface Props {
    path: string;
    children: React.ReactNode;
}

function ProtectedRoute({ children, ...rest }: Props): JSX.Element {

    const { authState } = React.useContext(AuthContext);

    return (
        <Route 
            {...rest}
            render={({ location }) => authState.hasAuthenticated 
                ? children
                : <Redirect to={{ 
                    pathname: '/',
                    state: { from: location }
                }}/>
            }/>
    );
}

export default ProtectedRoute;