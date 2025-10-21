import React, { useState, useCallback } from 'react';
import { useNavigate, useNavigation } from 'react-router-dom';

function generatePlayer() {
  const usernames = ['Alice12', 'Bob23', 'Charlie34', 'Diana56', 'Ethan78'];
  const ages = [22, 25, 30, 28, 35];
  const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Miami, FL'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];
  const signatureMoves = ['The Smash', 'The Drop Shot', 'The Lob', 'The Volley'];
  const competitionLevels = ['Casual', 'Competitive', 'Professional'];
  const matchesPlayed = Math.floor(Math.random() * 20);
  const matchesWon = Math.floor(Math.random() * (matchesPlayed + 1));
  const chatIds = [1, 2, 3, 4, 5];

  return {
    username: usernames[Math.floor(Math.random() * usernames.length)],
    age: ages[Math.floor(Math.random() * ages.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    skillLevel: skillLevels[Math.floor(Math.random() * skillLevels.length)],
    signatureMove: signatureMoves[Math.floor(Math.random() * signatureMoves.length)],
    competitionLevel: competitionLevels[Math.floor(Math.random() * competitionLevels.length)],
    rating: (Math.random() * 5).toFixed(1),
    matchesPlayed,
    matchesWon,
    chatId: chatIds[Math.floor(Math.random() * chatIds.length)],
  };
}

export function Match() {
  const [player, setPlayer] = useState(() => generatePlayer());
  const [isNextSpinning, setIsNextSpinning] = useState(false);
  const [isChatSpinning, setIsChatSpinning] = useState(false);


  const navigate = useNavigate();
  const navigation = useNavigation();
  const isRouting = navigation.state !== 'idle';

  const handleNextPlayer = useCallback(() => {
    setIsNextSpinning(true);
    setPlayer(generatePlayer());
    setIsNextSpinning(false);
  }, []);

  const handleChat = useCallback(() => {
    setIsChatSpinning(true);
    // TODO: implement chat endpoint and logic
    // 1. does a session already exist? (this could be
    // true if the player was clicked on through the map or chat pages)
    // 2. if not, create a new chat session between the two players
    setIsChatSpinning(false);
    navigate(`/chat/${player.chatId}`);
  }, [player]);

  return (
    <div className="container-fluid px-4 d-flex flex-column min-vh-100">
      <header className="container-fluid px-4 d-flex justify-content-center align-items-center gap-4 py-3">
        <h1>
          <img src="/question_mark.png" alt="PlayerImg" width="75" /> {player.username}
        </h1>
      </header>

      <main className="container-fluid px-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-5 pb-5">
        <div className="mb-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h3>About</h3>
          <div>
            <strong>Age:</strong> {player.age} <br />
            <strong>Location:</strong> {player.location}<br />
            <strong>Skill Level:</strong> {player.skillLevel}<br />
            <strong>Signature move:</strong> {player.signatureMove}<br />
            <strong>Competition Level:</strong> {player.competitionLevel}<br />
          </div>
          <br />
          <h3>Player Stats</h3>
          <div>
            <strong>Player Rating:</strong> {player.rating} (websocket data)<br />
            <strong>Player Rating:</strong> {player.rating} (websocket data)<br />
            <strong>Matches Played This Week:</strong>{' '}
            <span id="matchesPlayed">{player.matchesPlayed} (websocket data)</span><br />
            <strong>Matches Won This Week:</strong>{' '}
            <span id="matchesWon">{player.matchesWon} (websocket data)</span><br />
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap justify-content-center">
          <button
            className={`btn btn-primary btn-sm ${isNextSpinning ? 'spinning' : ''}`}
            type="button"
            onClick={handleNextPlayer}
            disabled={isNextSpinning || isRouting}
          >
            Next Player
          </button>

          <button
            className={`btn btn-success btn-sm ${isChatSpinning ? 'spinning' : ''}`}
            type="button"
            onClick={handleChat}
            disabled={isChatSpinning || isRouting}
          >
            Chat with Player
          </button>
        </div>
      </main>
    </div>
  );
}