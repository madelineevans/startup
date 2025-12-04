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

// async function fetchChatHistory(chatIdNum) {
//   const res = await fetch(`/api/chat/history/${chatIdNum}`);
//   const data = await res.json();
//   return data.messages || [];
//   // Replace with real api call to GET chat history based on Id
//   // return [
//   // { id: 1, sender: get_chat_name(chatIdNum), text: 'Hey! Want to play pickleball this weekend?' },
//   // { id: 2, sender: userName, text: "Sounds fun! What's your availability?" },
//   // ];
// }

// async function sendChatMessage(chatIdNum, sender, text) {
//   // Replace with real POST/PUT call to chat history
//   console.log(`Pretending to send message: "${text}" from ${sender} to chat ${chatIdNum}`);
//   return { id: Date.now(), sender, text };
// }

export function Chat() {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const chatIdNum = Number(chatId);
  console.log(`Rendering Chat with: ${get_chat_name(chatIdNum)}`);

  if (!chatId || Number.isNaN(chatIdNum)) {
    return <Navigate to="/chat_list" replace />;
  }

  const userName = sessionStorage.getItem('userName') || 'You';
  const [chatName, setChatName] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');

  const handleIncoming = React.useCallback((msg) => {
    setMessages((prev) => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
  }, []);

  const socketRef = React.useRef(null);

  React.useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}/ws?chatId=${chatIdNum}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handleIncoming(msg);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [chatIdNum, handleIncoming]);

  React.useEffect(() => {
    // Fetch chat history first
    fetch(`/api/chat/history/${chatIdNum}`)
      .then(res => res.json())
      .then(async data => {
        setMessages(data.messages || []);
        // Get the other participant's ID
        const userId = sessionStorage.getItem('userId');
        const otherId = data.participants.find(p => p !== userId);
        if (otherId) {
          // Fetch the name from your new endpoint
          const res = await fetch('/api/player/names', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: [otherId] }),
          });
          const names = await res.json();
          setChatName(names[0]?.name || 'Chat');
        }
      });
  }, [chatIdNum]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    const sentMessage = { 
      chat_id: chatIdNum,
      player_id: sessionStorage.getItem('userId'),
      message: trimmed
    };
    setMessages((prev) => [...prev, sentMessage]);
    setNewMessage('');

    try {
      socketRef.current?.send(JSON.stringify(sentMessage));
    } catch (e) {
      console.error('WS send failed:', e);
    }

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
      <header className="container-fluid px-4 d-flex justify-content-between py-3 px-4" style={{ background: '#8C33B6' }}>
        <h1>
          <img src="/question_mark.png" alt="logo" width="50" /> {chatName}
        </h1>
        <span className="fw" style={{ color: '#000000', alignSelf: 'flex-start' }}>
          {sessionStorage.getItem('userName')}
        </span>
      </header>

      <main className="container-fluid px-4">
        <div id="chatbox" ref={chatboxRef} className="mb-3">
          {messages.map((msg) => {
            const isMe = msg.sender === 'You' || msg.sender === userName;
            return (
              <div key={msg.id}>
                <strong>{isMe ? userName : chatName}:</strong> {msg.text}
                <br />
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSend} className="d-flex align-items-center gap-2 mt-2">
          <input
            type="text"
            placeholder="Type your message"
            className="form-control"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={!newMessage.trim()}
            style={{whiteSpace: 'nowrap'}}
          >
            Send
          </button>
        </form>

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
