import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';

// if (!player) return <div>Loading player...</div>; //i am testing this line still

async function fetchPlayerById(playerId) {
  // Replace with actual API call to player database
  return players[playerId] || null;
}

export function Match() {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [isNextSpinning, setIsNextSpinning] = useState(false);
  const [isChatSpinning, setIsChatSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const navigate = useNavigate();
  const navigation = useNavigation();
  const isRouting = navigation.state !== 'idle';

  useEffect(() => {
    let ignore = false;

    async function load() {
      setIsLoading(true);
      try {
        if (playerId) {
          const fetchedPlayer = await fetchPlayerById(parseInt(playerId));
          if (!ignore) setPlayer(fetchedPlayer);
        } else {
          // no route param? ask the backend for a match
          const res = await fetch('/api/match', { method: 'GET' });
          if (res.ok) {
            const data = await res.json();
            if (!ignore) setPlayer(data);
          }
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [playerId]);

  const handleNextPlayer = async () => {
    setIsNextSpinning(true);
    try {
      const response = await fetch('/api/match', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setPlayer(data);
      } else {
        const body = await response.json().catch(() => ({}));
        alert(`⚠ Error: ${body.msg || 'Failed to get next match'}`);
      }
    } catch (err) {
      console.error('Unknown error in Match Handler:', err);
    } finally {
      setIsNextSpinning(false);
    }
  };
  
  const handleCreateAccount = async () => {
    //setIsCreatingAccount(true);
    navigate('/newAccount');
  }

  const handleChat = useCallback(() => {
    setIsChatSpinning(true);
    // TODO: implement chat endpoint and logic
    // 1. does a session already exist? (this could be
    // true if the player was clicked on through the map or chat pages)
    // 2. if not, create a new chat session between the two players (this needs to 
    //  create a new chat id that is specific to the two players chat together)
    setIsChatSpinning(false);
    if (!player) return;
    navigate(`/chat/${player.chatId}`);
  }, [player, navigate]);

  if (isLoading || !player) {
    return (
      <div className="container-fluid px-4 d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <div>Loading player...</div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 d-flex flex-column min-vh-100">
      <header className="container-fluid px-4 d-flex justify-content-center align-items-center gap-4 py-3">
        <h1>
          <img src="/question_mark.png" alt="PlayerImg" width="75" /> {player.name}
        </h1>
      </header>

      <main className="container-fluid px-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-5 pb-5">
        <div className="mb-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h3>About</h3>
          <div>
            <strong>Age:</strong> {player.age} <br />
            <strong>Location:</strong> {player.location}<br />
            <strong>Skill Level:</strong> {player.skill_level}<br />
            <strong>Signature move:</strong> {player.signature_move}<br />
            <strong>Competition Level:</strong> {player.competition_level}<br />
          </div>
          <br />
          <h3>Player Stats</h3>
          <div>
            <strong>Player Rating:</strong> {player.player_rating}<br />
            <strong>Matches Played This Week:</strong>
            <span id="matchesPlayed">{player.matches_played}</span><br />
            <strong>Matches Won This Week:</strong>{' '}
            <span id="matchesWon">{player.matches_won}</span><br />
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