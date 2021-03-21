import React from 'react';

interface AuthState {
    hasAuthenticated: boolean;
}

const initialState: AuthState = {
    hasAuthenticated: false
}

const AuthStateContext = React.createContext(({} as AuthState));

/**
 * Provides read access to auth state
 */
export function useAuthState (): AuthState {
    const context = React.useContext(AuthStateContext);

    if (!context) {
        throw new Error('Context not provided');
    }

    return context;
}

type AuthDispatchAction = 
    | {
        type: 'LOGIN_SUCCESS';
        hasAuthenticated: boolean;
    }
    | {
        type: 'LOGOUT';
        hasAuthenticated: false;
    };

function authDispatch (state: AuthState, action: AuthDispatchAction): AuthState {
    switch(action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                ...{
                    hasAuthenticated: action.hasAuthenticated
                }
            }
            case 'LOGOUT':
            return {
                ...state,
                ...{
                    hasAuthenticated: action.hasAuthenticated
                }
            }
        default:
            return state;
    }
}

export type AuthDispatch = React.Dispatch<AuthDispatchAction>;

const AuthStateDispatch = React.createContext(({} as  AuthDispatch));

/**
 * Provides write access to auth state
 */
export function useAuthDispatch (): AuthDispatch {
    const dispatch = React.useContext(AuthStateDispatch);

    if (!dispatch) {
        throw new Error('Dispatch not provided');
    }

    return dispatch;
}

interface Props {
    children: React.ReactNode;
}

/**
 * React Context provider for auth state
 * 
 * @param props [children] React child node
 */
export default function AuthProvider (props: Props): JSX.Element {
    
    const [state, dispatch] = React.useReducer(authDispatch, initialState);

    return (
        <AuthStateContext.Provider value={state}>
            <AuthStateDispatch.Provider value={dispatch}>
                { props.children }
            </AuthStateDispatch.Provider>
        </AuthStateContext.Provider>
    );
}