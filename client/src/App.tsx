import React from 'react';
import useGoogleOAuth from './hooks/useGoogleOAuth';
import LoginPage from './pages/LoginPage';

export default function App() {

  useGoogleOAuth();

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <LoginPage/>
    </div>
  );
}