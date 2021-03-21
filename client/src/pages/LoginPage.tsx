import * as React from 'react';
import { requestZCTest } from '../asyncHelpers/authService';

export default function LoginPage() {

    React.useEffect(() => {
        async function requestTest() {
          try {
            console.log('run request');
    
            const response = await requestZCTest();
    
            console.log('test response', response);
    
          } catch (e) {
            console.log('Error - requestTest', e);
    
          } finally {
            console.log('test request completed');
          }
        }
    
        requestTest();
    
      }, []);

    return (
        <div>
            <h1>Login Page</h1>
            {/* <div className="g-signin2" data-onsuccess="onSignIn"></div> */}
            <div id="g-signin2"></div>
        </div>
    );
}