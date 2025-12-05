// Chat.jsx
import React from 'react';
import './chat.css';
import { useNavigate, useParams, Navigate } from 'react-router-dom';

export function Chat() {
  console.log("Rendering Chat component");
  const navigate = useNavigate();
  const { chatId } = useParams();

  // If there's no chatId in the URL, bounce back to chat list
  if (!chatId) {
    return <Navigate to="/chat_list" replace />;
  }

  // Keep chatId as a string (matches backend: { "chatId": "69326c451e7138de38945fcc" })
  const chatIdStr = chatId;

  // Normalize userId; stored as string in sessionStorage, but backend usually uses numbers
  const userIdStr = sessionStorage.getItem('userId');
  const userId = userIdStr ? String(userIdStr) : null;
  const userName = sessionStorage.getItem('userName') || 'You';

  const [chatName, setChatName] = React.useState('Chat');
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');

  const socketRef = React.useRef(null);
  const chatboxRef = React.useRef(null);

  // Handle incoming WS messages
  const handleIncoming = React.useCallback((msg) => {
    // msg should look like: { id, chat_id, player_id, message }
    setMessages((prev) => [...prev, msg]);
  }, []);

  // WebSocket connection
  React.useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${window.location.host}/ws?chatId=${encodeURIComponent(
      chatIdStr
    )}`;
    console.log('Connecting to WebSocket:', wsUrl);

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      console.log('WS message:', event.data);
      try {
        const msg = JSON.parse(event.data);
        handleIncoming(msg);
      } catch (err) {
        console.warn('Malformed WS message, ignoring:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.close();
    };
  }, [chatIdStr, handleIncoming]);

  // Fetch initial history + set chatName
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/chat/${encodeURIComponent(chatIdStr)}`);
        const data = await res.json();

        // Expecting data.messages as an array of:
        // { id, chat_id, player_id, message }
        setMessages(data.messages || []);

        // participants: [userId, otherUserId]
        const myId = userId;
        const participants = data.participants || [];

        // If backend uses numeric IDs, this will work fine.
        const otherId = participants.find((p) => p !== myId);

        if (otherId != null) {
          const nameRes = await fetch('/api/player/names', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: [otherId] }),
          });
          const names = await nameRes.json();
          setChatName(names[0]?.name || 'Chat');
        } else {
          setChatName('Chat');
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    })();
  }, [chatIdStr, userId]);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed || !userId) return;

    const sentMessage = {
      id: Date.now(), // temporary client-side ID
      chat_id: chatIdStr, // keep as string
      player_id: userId,  // number
      message: trimmed,
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, sentMessage]);
    setNewMessage('');

    // Send via WebSocket
    try {
      socketRef.current?.send(JSON.stringify(sentMessage));
    } catch (err) {
      console.error('WS send failed:', err);
    }

    // Persist via HTTP API
    try {
      await fetch(`/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sentMessage),
      });
    } catch (error) {
      console.error('Error sending message to API:', error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <header
        className="container-fluid px-4 d-flex justify-content-between py-3 px-4"
        style={{ background: '#8C33B6' }}
      >
        <h1>
          <img src="/question_mark.png" alt="logo" width="50" /> {chatName}
        </h1>
        <span
          className="fw"
          style={{ color: '#000000', alignSelf: 'flex-start' }}
        >
          {userName}
        </span>
      </header>

      <main className="container-fluid px-4 d-flex flex-column flex-grow-1">
        <div
          id="chatbox"
          ref={chatboxRef}
          className="flex-grow-1 mb-3 p-3 chatbox"
        >
          {messages.map((msg, index) => {
            const isMe = msg.player_id === userId;
            return (
              <div
                key={msg.id ?? index}
                className={
                  isMe
                    ? 'chat-message chat-message--me'
                    : 'chat-message chat-message--other'
                }
              >
                <strong>{isMe ? userName : chatName}:</strong> {msg.message}
              </div>
            );
          })}
        </div>

        <form
          onSubmit={handleSend}
          className="d-flex align-items-center gap-2 mt-2"
        >
          <input
            type="text"
            placeholder="Type your message"
            className="form-control"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
            Send
          </button>
        </form>
      </main>
      <footer>
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-bottom">
          <div className="container-fluid">
            <ul className="navbar-nav mx-auto d-flex flex-row gap-3">
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link active btn btn-link"
                  onClick={() => navigate('/login')}
                >
                  Logout
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link active btn btn-link"
                  onClick={() => navigate('/match')}
                >
                  Match
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link active btn btn-link"
                  onClick={() => navigate('/map')}
                >
                  Map
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link active btn btn-link"
                  onClick={() => navigate('/chat_list')}
                >
                  Chats
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </footer>
    </div>
  );
}
