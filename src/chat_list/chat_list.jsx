import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

async function getChatList() {
  console.log("fetching chatlist");
  const res = await fetch(`/api/chat/list`);
  console.log("chatlist response:", res);
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
  const [playerNames, setPlayerNames] = useState({}); //id -> name
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //console.log("currentUserId:", sessionStorage.getItem('userId'));
  const currentUserId = sessionStorage.getItem('userId');
  console.log("currentUserId ", currentUserId);

  // Fetch chat list on component mount
  useEffect(() => {
    async function loadChatList() {
      const data = await getChatList();
      console.log("chat list data:", data);
      if (data) {
        setChatList(data);
        const otherIds = new Set();

        data.forEach(chat => {
          chat.participants.forEach(pId => {
            console.log("participant id:", pId);
            if (!currentUserId || pId !== currentUserId) {
              otherIds.add(pId);
            }
          });
        });

        console.log("otherIds to fetch names for:", otherIds);
        if (otherIds.size > 0) {
          try {
            const res = await fetch('/api/player/names', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ids: Array.from(otherIds) }),
            });

            if (res.ok) {
              // assuming backend returns something like: { "id1": "Alice", "id2": "Bob" }
              console.log("fetchPlayerNames response: ", res);
              const namesArray = await res.json();
              const namesMap = {};
              namesArray.forEach(({ playerId, name }) => {
                namesMap[playerId] = name;
              });
              console.log("fetched player names:", namesMap);
              setPlayerNames(namesMap);
            } else {
              console.error("Failed to fetch player names");
            }
          } catch (err) {
            console.error("Error fetching player names", err);
          }
        }
      }
      setLoading(false);
    }
    loadChatList();
  }, [currentUserId]);

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
            chatList.map((chat) => {
              let otherParticipantId =
                chat.participants.find(pId => pId !== currentUserId) ||
                chat.participants[0];

              const otherName =
                playerNames[otherParticipantId] || 'Unknown player';

              return (
                <button
                  key={chat._id}
                  className="btn btn-primary mb-2 w-100"
                  onClick={() => handleChatClick(chat._id)}
                >
                  Chat with {otherName}
                </button>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}