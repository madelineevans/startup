import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Chat_list() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid px-4 d-flex flex-column min-vh-100">
      <header className="text-center py-3">
        <h1>Chats</h1>
      </header>

      <main className="container-fluid px-4 flex-grow-1 d-flex flex-column align-items-center">
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
    </div>
  );
}
