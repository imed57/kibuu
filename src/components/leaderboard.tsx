import React from 'react';

interface PlayerScore {
  address: string;
  score: number;
}

const mockData: PlayerScore[] = [
  { address: '0x1234567890abcdef1234567890abcdef12345678', score: 150 },
  { address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef', score: 120 },
  { address: '0x9876543210abcdef1234567890abcdef12345678', score: 100 },
];

const Leaderboard: React.FC = () => {
  return (
    <div className="leaderboard">
      <h2 className="title">Leaderboard</h2>
      <div className="scoreContainer">
        {mockData.map((player, index) => (
          <div key={index} className={`scoreItem rank${index + 1}`}>
            <span>{index + 1}. </span>
            <span>{player.address}</span>
            <span> - Score: {player.score}</span>
          </div>
        ))}
      </div>

      {/* Add an image below the scores */}
      <div className="imageContainer">
        <img src="/kibu-trophy.png" alt="Leaderboard Icon" className="image" />
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .leaderboard {
          width: 33vw;
          height: 52vh;
          border: 1px solid #ddd;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(4, 0, 255, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          overflow: hidden;
          background-image: url('/stala.png'); /* Access image from public folder */
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
          font-family: 'Ubuntu';
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          flex-grow: 1;
        }

        .scoreItem {
          margin: 7px 0;
          font-size: 16px;
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
