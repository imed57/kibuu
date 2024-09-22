import React from 'react';
import styles from '../styles/leaderboard.module.css';

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
    <div className={styles.leaderboard}>
      <h2 className={styles.title}>Leaderboard</h2>
      <div className={styles.scoreContainer}>
        {mockData.map((player, index) => (
          <div 
            key={index} 
            className={`${styles.scoreItem} ${styles[`rank${index + 1}`]}`}
          >
            <span>{index + 1}. </span>
            <span>{player.address}</span>
            <span> - Score: {player.score}</span>
          </div>
        ))}
      </div>

      {/* Add an image below the scores */}
      <div className={styles.imageContainer}>
        <img src="/kibu-trophy.png" alt="Leaderboard Icon" className={styles.image} />
      </div>
    </div>
  );
};

export default Leaderboard;
