import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

async function getChatList() {
  console.log("fetching chatlist");
  const res = await fetch(`/api/chat/list`);
  if (!res.ok) return null;
  return await res.json();
}

async function fetchPlayerById(playerId) {
  // Replace with actual API call to player database
  console.log("fetching player by id for match page:", playerId);
  const res = await fetch(`/api/player/${playerId}`);
  if (!res.ok) return null;
  return await res.json();
}

export function Chat_list() {
  console.log("in Chat_list component");
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch chat list on component mount
  useEffect(() => {
    async function loadChatList() {
      const data = await getChatList();
      if (data) {
        setChatList(data);
      }
      setLoading(false);
    }
    loadChatList();
  }, []);

  const handleChatClick = useCallback((chatId) => {
    console.log(`Clicked chat with id: ${chatId}`);
    navigate(`/chat/${chatId}`);
  }, [navigate]);

  return (
    <div className="container-fluid px-4 d-flex flex-column min-vh-100">
      <header className="text-center py-3">
        <h1>Chats</h1>
      </header>

      <main className="container-fluid px-4 flex-grow-1 d-flex flex-column align-items-center">
        <div className="mb-3">
          {loading ? (
            <p>Loading chats...</p>
          ) : chatList.length === 0 ? (
            <p>No chats yet. Go find some friends!</p>
          ) : (
            chatList.map((chat) => (
              <button
                key={chat._id}
                className="btn btn-primary mb-2 w-100"
                onClick={() => handleChatClick(chat._id)}
              >
                Chat with {chat.name}
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}