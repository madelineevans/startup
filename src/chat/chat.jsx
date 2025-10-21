import React from 'react';
import './chat.css';
import { useNavigate, useParams, Navigate } from 'react-router-dom';

function get_chat_name(chatIdNum) {
  if (chatIdNum === 1) return 'Joe Mamma';
  if (chatIdNum === 2) return 'PicklePlayer';
  if (chatIdNum === 3) return 'AceGamer';
  if (chatIdNum === 4) return 'SmashMaster';
  if (chatIdNum === 5) return 'VolleyQueen';
  return 'Unknown User';
}

export function Chat() {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const chatIdNum = Number(chatId);

  if (!chatId || Number.isNaN(chatIdNum)) {
    return <Navigate to="/chat_list" replace />;
  }

  const chatName = get_chat_name(chatIdNum);

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="container-fluid px-4 d-flex justify-content-between py-3 px-4" style={{ background: '#8C33B6' }}>
        <h1>
          <img src="/question_mark.png" alt="logo" width="50" /> {chatName}
        </h1>
        <span className="fw" style={{ color: '#000000', alignSelf: 'flex-start' }}>
          {sessionStorage.getItem('userName')}
        </span>
      </header>

      <main className="container-fluid px-4">
        <div id="chatbox" className="mb-3">
          <div>
            <strong>{chatName}:</strong> Hey PicklePlayer! Want to play some pickleball this weekend?
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
            </ul>
          </div>
        </nav>
      </footer>
    </div>
  );
}
