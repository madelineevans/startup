import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className="body bg-dark text-light">
      <header className="container-fluid">
        <nav className="navbar fixed-top navbar-dark">
          <div className="navbar-brand">
            Pickleplay<sup>&reg;</sup>
          </div>
          <menu className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="login.jsx">
                Login
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="chat_list.jsx">
                Chats
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="map.jsx">
                Map
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="match.jsx">
                Match
              </a>
            </li>
          </menu>
        </nav>
      </header>

      <main>App components go here</main>

      <footer className="bg-dark text-white-50">
        <div className="container-fluid">
          <span className="text-reset">Author Name(s)</span>
          <a className="text-reset" href="https://github.com/webprogramming260/simon-react">
            Source
          </a>
        </div>
      </footer>
    </div>
  );
}