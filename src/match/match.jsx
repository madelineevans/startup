import React, { useState } from 'react';
import './match.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import question_mark from '../Images/question_mark.png';

export function Match() {
  const [isNextSpinning, setIsNextSpinning] = useState(false);
  const [isChatSpinning, setIsChatSpinning] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="d-flex justify-content-center align-items-center gap-4 py-3">
        <h1>
          <img src={question_mark} alt="PlayerImg" width="75" /> John Doe
        </h1>
      </header>

      <main className="container flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-5 pb-5">
        <div className="mb-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h3>About</h3>
          <div>
            <strong>Age:</strong> 25 <br />
            <strong>Location:</strong> Provo, UT<br />
            <strong>Skill Level:</strong> Intermediate<br />
            <strong>Signature move:</strong> The Dink<br />
            <strong>Competition Level:</strong> I want to have fun<br />
          </div>
          <br />
          <h3>Player Stats</h3>
          <div>
            <strong>Player Rating:</strong> 4.5 (websocket data)<br />
            <strong>Matches Played This Week:</strong>{' '}
            <span id="matchesPlayed">5 (websocket data)</span><br />
            <strong>Matches Won This Week:</strong>{' '}
            <span id="matchesWon">3 (websocket data)</span><br />
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap justify-content-center">
          <button
            className={`btn btn-primary btn-sm ${isNextSpinning ? 'spinning' : ''}`}
            type="button"
            onClick={() => {
              setIsNextSpinning(true);
              setTimeout(() => {
                navigate('/match');
              }, 500);
            }}
            disabled={isNextSpinning}
          >
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">Next Player</span>
          </button>

          <button
            className={`btn btn-success btn-sm ${isChatSpinning ? 'spinning' : ''}`}
            type="button"
            onClick={() => {
              setIsChatSpinning(true);
              setTimeout(() => {
                navigate('/chat');
              }, 500);
            }}
            disabled={isChatSpinning}
          >
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">Chat with Player</span>
          </button>
        </div>
      </main>

      <footer>
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-bottom">
          <div className="container-fluid">
            <ul className="navbar-nav mx-auto d-flex flex-row gap-3">
              <li className="nav-item">
                <button type="button" className="nav-link active btn btn-link" onClick={() => navigate('/login')}>Logout</button>
              </li>
              <li className="nav-item">
                <button type="button" className="nav-link btn btn-link text-secondary disabled" disabled>Match</button>
              </li>
              <li className="nav-item">
                <button type="button" className="nav-link active btn btn-link" onClick={() => navigate('/map')}>Map</button>
              </li>
              <li className="nav-item">
                <button type="button" className="nav-link active btn btn-link" onClick={() => navigate('/chat_list')}>Chats</button>
              </li>
              {/* <li className="nav-item">
                <button type="button" className="nav-link active btn btn-link" onClick={() => navigate('/profile')}>Profile</button>
              </li> */}
            </ul>
          </div>
        </nav>
      </footer>
    </div>
  );
}