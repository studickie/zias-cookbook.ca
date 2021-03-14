import React from 'react';

interface AuthState {
    isSignedIn: boolean;
}

const initialState: AuthState = {
    isSignedIn: false
}

const AuthStateContext = React.createContext(({} as AuthState));

/**
 * Provides read access to auth state
 * @returns AuthState
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
        type: 'SET_IS_SIGNED_IN';
        isSignedIn: boolean;
    };

function authDispatch (state: AuthState, action: AuthDispatchAction): AuthState {
    switch(action.type) {
        default:
            return state;
    }
}

export type AuthDispatch = React.Dispatch<AuthDispatchAction>;

const AuthStateDispatch = React.createContext(({} as  AuthDispatch));

/**
 * Provides write access to auth state
 * @returns AuthDispatch
 */
export function useAuthDispatch (): AuthDispatch {
    const dispatch = React.useContext(AuthStateDispatch);

    if (!dispatch) {
        throw new Error('Dispatch not provided');
    }

    const mountedRef = React.useRef<boolean>(false);

    React.useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false
        }
    }, []);

    return React.useCallback((...args) => {
        return mountedRef.current && dispatch(...args)
    }, [dispatch]);
}

interface Props {
    children: React.ReactNode;
}

/**
 * Auth state context provider
 * @param props [children] React child node
 * @returns 
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