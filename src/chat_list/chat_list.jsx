import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function generateChatList() {
  return [
    { id: 1, name: 'Joe Mamma' },
    { id: 2, name: 'PicklePlayer' },
    { id: 3, name: 'AceGamer' },
    { id: 4, name: 'SmashMaster' },
    { id: 5, name: 'VolleyQueen' }
  ];
}
function get_chat_name(chatId) {
  if (chatId === 1) {
    return 'Joe Mamma';
  }
  else if (chatId === 2) {
    return 'PicklePlayer';
  }
  else if (chatId === 3) {
    return 'AceGamer';
  }
  else if (chatId === 4) {
    return 'SmashMaster';
  }
  else if (chatId === 5) {
    return 'VolleyQueen';
  }
  return 'Unknown User';
}

export function Chat_list() {
  const [chatList, setChatList] = React.useState(() => generateChatList());
  const navigate = useNavigate();

  const get_chat_list = useCallback(() => {
    // TODO: implement chat list retrieval logic
    setChatList(generateChatList());
  }, []);

  const handleChatClick = useCallback((chatId) => {
    // TODO: implement chat session retrieval logic
    // navigate(`/chat/${chatId}`);
    get_chat_name(chatId);
    navigate(`/chat/${chatId}`);
  });

  return (
    <div className="container-fluid px-4 d-flex flex-column min-vh-100">
      <header className="text-center py-3">
        <h1>Chats</h1>
      </header>

      <main className="container-fluid px-4 flex-grow-1 d-flex flex-column align-items-center">
        <div className="mb-3">
          {/* Render chat buttons dynamically */}
          {chatList.map((chat) => (
            <button
              key={chat.id}
              className="btn btn-primary mb-2 w-100"
              onClick={() => handleChatClick(chat.id)}
            >
              Chat with {chat.name}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
