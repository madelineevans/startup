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
    if (playerId) {
      setIsLoading(true);
      fetchPlayerById(parseInt(playerId))
        .then(fetchedPlayer => {
          if (fetchedPlayer) {
            setPlayer(fetchedPlayer);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [playerId]);

  const handleNextPlayer = async () => {
    setIsNextSpinning(true);
    try{
        const response = await fetch('/api/match', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerId: document.getElementById('playerId').value,
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            location: document.getElementById('location').value,
            skill_level: document.getElementById('skill_level').value,
            signature_move: document.getElementById('signature_move').value,
            competition_level: document.getElementById('competition_level').value,
            player_rating: document.getElementById('player_rating').value,
            matches_played: document.getElementById('matches_played').value,
            matches_won: document.getElementById('matches_won').value,
          }),
        });

        if (response.status === 200) {
          const data = await response.json();
          setPlayer(data);
        } else {
          const body = await response.json();
          alert(`⚠ Error: ${body.msg}`);
        }
        setIsNextSpinning(false);
      } catch (err) {
        console.error('Unknown error in Match Handler:', err);
      }
    }
  
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
    navigate(`/chat/${player.chatId}`);
  }, [player, navigate]);

  if (isLoading) {
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
            <strong>Player Rating:</strong> {player.rating}<br />
            <strong>Player Rating:</strong> {player.rating}<br />
            <strong>Matches Played This Week:</strong>{' '}
            <span id="matchesPlayed">{player.matchesPlayed}</span><br />
            <strong>Matches Won This Week:</strong>{' '}
            <span id="matchesWon">{player.matchesWon}</span><br />
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