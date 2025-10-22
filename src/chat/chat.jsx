import React from 'react';
import './chat.css';
import { useNavigate, useParams, Navigate } from 'react-router-dom';

// --- Mock WebSocket -----------------------------------------
function mockReplyTo(text) {
  const lower = text.toLowerCase();
  if (lower.includes('time') || lower.includes('when')) return "Saturday morning works for me!";
  if (lower.includes('where')) return "How about the City Park courts?";
  if (lower.includes('hello') || lower.includes('hi')) return "Hey hey!";
  if (lower.includes('pickle')) return "Dill with it! 🥒";
  return "Sounds good!";
}

function useMockSocket(chatIdNum, onMessage) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    let closed = false;

    ref.current = {
      // send a message to the "server"
      send(payload) {
        try {
          const data = JSON.parse(payload);
          if (data?.type === 'message') {
            // simulate server broadcasting message to others
            // simulate a reply from the other player
            setTimeout(() => {
              if (closed) return;
              console.log('Id:', chatIdNum);
              console.log('Mock WS received message from:', get_chat_name(chatIdNum));
              onMessage({
                id: Date.now() + 1,
                sender: get_chat_name(chatIdNum),
                text: mockReplyTo(data.text),
                ts: new Date().toISOString(),
              });
            }, 800);
          }
        } catch {
          // ignore malformed payloads
        }
      },
      close() { closed = true; },
      get readyState() { return 1; }, // mimic WebSocket.OPEN
    };

    // simulate random typing
    const randomPing = setInterval(() => {
      if (closed) return;
      onMessage({
        id: Date.now() + Math.floor(Math.random() * 1000),
        sender: get_chat_name(chatIdNum),
        text: "👍",
        ts: new Date().toISOString(),
      });
    }, 30000);

    return () => {
      closed = true;
      clearInterval(randomPing);
      ref.current = null;
    };
  }, [chatIdNum, onMessage]);

  return ref;
}

function get_chat_name(chatIdNum) {
  if (chatIdNum === 1) return 'Joe Mamma';
  if (chatIdNum === 2) return 'PicklePlayer';
  if (chatIdNum === 3) return 'AceGamer';
  if (chatIdNum === 4) return 'SmashMaster';
  if (chatIdNum === 5) return 'VolleyQueen';
  return 'Unknown User';
}

async function fetchChatHistory(chatIdNum, userName = 'You') {
  // Replace with real api call to GET chat history based on Id
  return [
  { id: 1, sender: get_chat_name(chatIdNum), text: 'Hey! Want to play pickleball this weekend?' },
  { id: 2, sender: userName, text: "Sounds fun! What's your availability?" },
  ];
}

async function sendChatMessage(chatIdNum, sender, text) {
  // Replace with real POST/PUT call to chat history
  console.log(`Pretending to send message: "${text}" from ${sender} to chat ${chatIdNum}`);
  return { id: Date.now(), sender, text };
}

export function Chat() {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const chatIdNum = Number(chatId);
  console.log(`Rendering Chat with: ${get_chat_name(chatIdNum)}`);

  if (!chatId || Number.isNaN(chatIdNum)) {
    return <Navigate to="/chat_list" replace />;
  }

  const chatName = get_chat_name(chatIdNum);
  const userName = sessionStorage.getItem('userName') || 'You';
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');

  const handleIncoming = React.useCallback((msg) => {
    setMessages((prev) => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
  }, []);

  const socketRef = useMockSocket(chatIdNum, handleIncoming);
  const chatboxRef = React.useRef(null);

  React.useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTo({ top: chatboxRef.current.scrollHeight });
    }
  }, [messages]);

  React.useEffect(() => {
    let ignore = false;
    fetchChatHistory(chatIdNum, userName).then((data) => {
      if (!ignore) setMessages(data);
    });
    return () => { ignore = true; };
  }, [chatIdNum]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    const sentMessage = { id: Date.now(), sender: userName, text: trimmed };
    setMessages((prev) => [...prev, sentMessage]);
    setNewMessage('');

    try {
      socketRef.current?.send(
        JSON.stringify({
          type: 'message',
          chatId: chatIdNum,
          sender: userName,
          text: trimmed,
        })
      );
    } catch (e) {
      console.error('Mock WS send failed:', e);
    }

    try {
      await sendChatMessage(chatIdNum, userName, trimmed);
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
