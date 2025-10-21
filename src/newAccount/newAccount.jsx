import React, { useState } from 'react';
import '../login/login.css';
import { useNavigate } from 'react-router-dom';

export function NewAccount() {
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    setIsSpinning(true);
    // TODO: Implement account creation endpoint
    sessionStorage.setItem('userName', 'Billy-Joel');
    navigate('/match');
  };

  return (
    <div className="container-fluid px-4 d-flex flex-column min-vh-100">
      <header className="container-fluid px-4 d-flex justify-content-center align-items-center gap-2 py-3">
        <img src="/pickle_logo.png" className="img-fluid" alt="logo" style={{ height: '90px' }} />
        <h1 className="merriweather mb-0">PicklePlayer</h1>
      </header>

      <main className="container-fluid px-4 flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <form className="d-flex flex-column gap-3">
            <div>
              <label htmlFor="firstName" className="form-label">First Name:</label>
              <input type="text" id="firstName" name="firstName" className="form-control" />
            </div>
            <div>
              <label htmlFor="lastName" className="form-label">Last Name:</label>
              <input type="text" id="lastName" name="lastName" className="form-control" />
            </div>
            <div>
              <label htmlFor="birthDate" className="form-label">Birth Date:</label>
              <input type="text" id="birthDate" name="birthDate" className="form-control" />
            </div>
            <div>
              <label htmlFor="emailAddress" className="form-label">Email:</label>
              <input type="text" id="emailAddress" name="emailAddress" className="form-control" />
            </div>
            <div>
              <label htmlFor="passowrd1" className="form-label">Password:</label>
              <input type="password" id="passowrd1" name="passowrd1" className="form-control" />
            </div>
            <div>
              <label htmlFor="passowrd2" className="form-label">Verify Password:</label>
              <input type="password" id="passowrd2" name="passowrd2" className="form-control" />
            </div>

            <br />
            <h3>Initial Survey:</h3>

            <div>
              <select className="form-select" aria-label="skillLevel">
                <option defaultValue>Skill Level</option>
                <option value="1">Never Played</option>
                <option value="2">Beginner</option>
                <option value="3">Intermediate</option>
                <option value="4">Advanced</option>
                <option value="5">Pro</option>
              </select>
            </div>
            <div>
              <select className="form-select" aria-label="timePlayed">
                <option defaultValue>Time Since Starting</option>
                <option value="1">Never Played</option>
                <option value="2">Couple Weeks</option>
                <option value="3">Couple Months</option>
                <option value="4">1-2 Years</option>
                <option value="5">2+ Years</option>
              </select>
            </div>
            <div>
              <select className="form-select" aria-label="playFrequency">
                <option defaultValue>Frequency of Play</option>
                <option value="1">Never Played</option>
                <option value="2">Nothing Consistent</option>
                <option value="3">Every Couple Months</option>
                <option value="4">Every Couple Weeks</option>
                <option value="5">Every Week</option>
              </select>
            </div>
            <div>
              <select className="form-select" aria-label="competetiveLevel">
                <option defaultValue>How competitive do you want to be?</option>
                <option value="1">I just need someone to learn with</option>
                <option value="2">I just want to have fun</option>
                <option value="3">I want it to be a little competitive</option>
                <option value="4">I want it to be competitive</option>
                <option value="5">Do or die</option>
              </select>
            </div>
            <div>
              <select className="form-select" aria-label="foundSite">
                <option defaultValue>How did you hear about us?</option>
                <option value="1">Through a friend</option>
                <option value="2">Online</option>
                <option value="3">Other</option>
              </select>
            </div>

            <br />
            <button
              className={`btn btn-primary btn-sm ${isSpinning ? 'spinning' : ''}`}
              type="button"
              onClick={handleCreateAccount}
              disabled={isSpinning}
            >
              <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
              <span role="status">Create New Account</span>
            </button>
          </form>
        </div>
      </main>

      <footer></footer>
    </div>
  );
}