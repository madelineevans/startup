import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';


export function Login() {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    // TODO: Implement login endpoint and logic
    sessionStorage.setItem('userName', 'Billy-Joel');
    navigate('/match');
  }

  const handleCreateAccount = () => {
    setIsCreatingAccount(true);
    navigate('/newAccount');
  }

  return (
    <div className="container-fluid px-4 d-flex flex-column min-vh-100 roboto-flex">
      <header className="d-flex justify-content-center align-items-center gap-2 py-3">
        <img src="/pickle_logo.png" className="img-fluid" alt="logo" style={{ height: "90px" }} />
        <h1 className="fascinate-inline-regular">PicklePlayer</h1>
      </header>
      <main className="container-fluid px-4 flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <form className="d-flex flex-column gap-3">
            <div>
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="text" id="email" name="email" className="form-control" />
            </div>
            <div>
              <label htmlFor="password" className="form-label">Password:</label>
              <input type="password" id="password" name="password" className="form-control" />
            </div>
            <div className="d-flex justify-content-center gap-2">
              <button
                className={`btn btn-primary btn-sm ${isLoggingIn ? 'spinning' : ''}`}
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
              >
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span role="status">Login</span>
              </button>
              <button
                className={`btn btn-secondary btn-sm ${isCreatingAccount ? 'spinning' : ''}`}
                type="button"
                onClick={handleCreateAccount}
                disabled={isCreatingAccount}
              >
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span role="status">Create New Account</span>
              </button>
            </div>
          </form>
        </div>
      </main>
      <footer className="text-center py-3">
        <a href="https://github.com/madelineevans/startup/tree/main">GitHub Repo</a>
        <p>Made by Chloe and Mae</p>
        <button id="authors">Show Authors</button>
      </footer>
    </div>
  );
}
