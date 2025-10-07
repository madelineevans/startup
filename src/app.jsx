import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Chat_list } from './chat_list/chat_list';
import { Map } from './map/map';
import { Match } from './match/match';

export default function App() {
  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header className="container-fluid">
          <nav className="navbar fixed-top navbar-dark">
            <div className="navbar-brand">
              Pickleplay<sup>&reg;</sup>
            </div>
            <menu className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/chat_list">
                  Chats
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/map">
                  Map
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/match">
                  Match
                </NavLink>
              </li>
            </menu>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path='/login' element={<Login />} exact />
            <Route path='/chat_list' element={<Chat_list />} />
            <Route path='/map' element={<Map />} />
            <Route path='/match' element={<Match />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>

        <footer className="bg-dark text-white-50">
          <div className="container-fluid">
            <span className="text-reset">Author Name(s)</span>
            <a className="text-reset" href="https://github.com/webprogramming260/simon-react">
              Source
            </a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}