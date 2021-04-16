import React from 'react';

interface AuthState {
    hasAuthenticated: boolean;
    token: string | null;
}

const initialState: AuthState = {
    hasAuthenticated: false,
    token: null
}

type AuthReducerActions =
    | {
        type: 'LOGIN';
        token: string;
    }
    | {
        type: 'LOGOUT'
    };

type AuthReducer = (state: AuthState, action: AuthReducerActions) => AuthState;

function authReducer(state: AuthState, action: AuthReducerActions): AuthState {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                ...{
                    hasAuthenticated: true,
                    token: action.token
                }
            };
        case 'LOGOUT':
            return {
                ...state,
                ...{
                    hasAuthenticated: false,
                    token: null
                }
            };
        default:
            return state;
    }
}

type AuthDispatch = React.Dispatch<AuthReducerActions>;

interface AuthProvider {
    authState: AuthState;
    authDispatch: AuthDispatch;
}

export const AuthContext = React.createContext(({} as AuthProvider));

interface Props {
    children: React.ReactNode;
}

export function AuthProvider({ children }: Props): JSX.Element {

    const [authState, authDispatch] = React.useReducer<AuthReducer>(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ authState, authDispatch }}>
            { children}
        </AuthContext.Provider>
    );
}