import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chat.css';
import { useNavigate } from 'react-router-dom';

export function Chat() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="container-fluid px-4 d-flex justify-content-between py-3 px-4" style={{ background: '#8C33B6' }}>
        <h1>
          <img src="/question_mark.png" alt="logo" width="50" /> Joe Mamma
        </h1>
        <span className="fw" style={{ color: '#000000', alignSelf: 'flex-start' }}>{sessionStorage.getItem('userName')}</span>
      </header>

      <main className="container-fluid px-4">
        <div id="chatbox" className="mb-3">
          <div>
            <strong>Joe Mamma:</strong> Hey PicklePlayer! Want to play some pickleball this weekend?
            <br />
            <strong>Other messages will be here</strong>
            <br />
          </div>
        </div>

        <div>
          <input
            type="search"
            id="search"
            name="varSearch"
            placeholder="type your message"
            className="form-control"
          />
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
                <button type="button" className="nav-link active btn btn-link" onClick={() => navigate('/match')}>Match</button>
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