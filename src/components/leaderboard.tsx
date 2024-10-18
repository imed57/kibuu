import React, { useEffect, useState } from 'react';
import { getContractInstance } from 'config/contract';
import { ethers } from 'ethers';

interface PlayerScore {
  address: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);
  const [isContractReady, setIsContractReady] = useState<boolean>(false);

  const fetchScores = async () => {
    try {
      const contract = await getContractInstance();
      const players: PlayerScore[] = [];

      for (let i = 0; i < 3; i++) {
        const playerAddress: string = await contract.topPlayers(i);
        const playerScoreBN = await contract.topScores(i);
        const playerScore = playerScoreBN.toNumber(); // Convert BigNumber to number

        if (playerAddress !== ethers.constants.AddressZero) {
          players.push({
            address: playerAddress,
            score: playerScore,
          });
        }
      }

      setPlayerScores(players);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  useEffect(() => {
    const initializeContract = async () => {
      try {
        const contract = await getContractInstance();
        if (contract) {
          setIsContractReady(true);
          fetchScores();
        }
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    initializeContract(); // Ensure the contract is initialized
    const interval = setInterval(fetchScores, 3000); // Fetch scores every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="leaderboard">
      <h2 className="title">Leaderboard</h2>
      <div className="scoreContainer">
        {playerScores.length > 0 ? (
          playerScores.map((player, index) => (
            <div key={index} className={`scoreItem rank${index + 1}`}>
              <span>{index + 1}. </span>
              <span>{`${player.address.slice(0, 5)}....${player.address.slice(-3)}`}</span>
              <span> - Score: {player.score}</span>
            </div>
          ))
        ) : (
          <div>No scores available</div>
        )}
      </div>
      
      {/* Image container for the "kibu" image */}
      <div className="imageContainer">
        <img src="/kibu-trophy.png" alt="Kibu" className="image" />
      </div>

      <style jsx>{`
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  .leaderboard {
    width: 45vw;
    height: 52vh;
    border: 4px solid #ddd;
    border-radius: 25px;
    box-shadow: 0 4px 12px rgba(34, 198, 248, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    overflow: hidden;
    background-image: url('/stala.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .title {
    font-family: 'Press Start 2P';
    color: rgb(255, 255, 255);
    text-align: center;
    margin: 10px 0;
    font-size: 28px;
  }

  .scoreContainer {
    font-family: 'Press Start 2P';
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex-grow: 1;
  }

  .scoreItem {
    margin: 7px 0;
    font-size: 14px;
    padding: 10px;
    border-radius: 16px;
    width: 80%;
    text-align: center;
  }

  .rank1 {
    background-color: rgb(255, 184, 5);
  }

  .rank2 {
    background-color: rgb(211, 211, 211);
  }

  .rank3 {
    background-color: #cd7f32;
  }

  .imageContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  .image {
    margin-bottom: 5vh;
    max-width: 120px;
    height: auto;
  }

  @media (max-height: 600px) {
    .leaderboard {
      height: 70vh;
      margin-top: 10vh;
    }

    .scoreItem {
      font-size: 14px;
    }

    .image {
      max-width: 80px;
    }
  }
`}</style>
    </div>
  );
};

export default Leaderboard;
