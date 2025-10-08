import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Chat_list() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="text-center py-3">
        <h1>Chats</h1>
      </header>

      <main className="container flex-grow-1 d-flex flex-column align-items-center">
        <div className="mb-3">
          {/* list of chats will appear here */}
          <button
            className="btn btn-primary mb-2"
            onClick={() => navigate('/chat')}
          >
            Chat with Joe Mamma
          </button>
          <br />
          <button
            className="btn btn-primary"
            onClick={() => navigate('/chat')}
          >
            Chat with PicklePlayer
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
                <button type="button" className="nav-link active btn btn-link" onClick={() => navigate('/match')}>Match</button>
              </li>
              <li className="nav-item">
                <button type="button" className="nav-link active btn btn-link" onClick={() => navigate('/map')}>Map</button>
              </li>
              <li className="nav-item">
                <button type="button" className="nav-link btn btn-link text-secondary disabled" disabled>Chats</button>
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
