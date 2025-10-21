import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './footer.css';

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if current path matches
  const isActive = (path) => location.pathname === path;

  return (
    <footer>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-bottom">
        <div className="container-fluid">
          <ul className="navbar-nav mx-auto d-flex flex-row gap-3">

            {/* Logout */}
            <li className="nav-item">
              <button
                type="button"
                className="nav-link active btn btn-link text-primary"
                onClick={() => navigate('/login')}
              >
                Logout
              </button>
            </li>

            {/* Match */}
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link btn btn-link ${
                  isActive('/match') ? 'text-secondary fw-bold' : 'text-primary'
                }`}
                onClick={() => navigate('/match')}
              >
                Match
              </button>
            </li>

            {/* Map */}
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link btn btn-link ${
                  isActive('/map') ? 'text-secondary fw-bold' : 'text-primary'
                }`}
                onClick={() => navigate('/map')}
              >
                Map
              </button>
            </li>

            {/* Chats */}
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link btn btn-link ${
                  isActive('/chat_list') ? 'text-secondary fw-bold' : 'text-primary'
                }`}
                onClick={() => navigate('/chat_list')}
              >
                Chats
              </button>
            </li>

            {/* Optional profile link */}
            {/* <li className="nav-item">
              <button
                type="button"
                className={`nav-link btn btn-link ${
                  isActive('/profile') ? 'text-primary fw-bold' : 'text-primary'
                }`}
                onClick={() => navigate('/profile')}
              >
                Profile
              </button>
            </li> */}
          </ul>
        </div>
      </nav>
    </footer>
  );
}
