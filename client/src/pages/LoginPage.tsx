import * as React from 'react';
import { requestZCTest } from '../asyncHelpers/authService';

export default function LoginPage() {

    React.useEffect(() => {
        //requestZCTest();
      }, []);

    return (
        <div>
            <h1>Login Page</h1>
            {/* <div className="g-signin2" data-onsuccess="onSignIn"></div> */}
            <div id="g-signin2"></div>
        </div>
    );
}