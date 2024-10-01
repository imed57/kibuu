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
            <span>{`${player.address.slice(0, 5)}....${player.address.slice(-3)}`}</span>
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


// import React, { useEffect, useState } from 'react';
// import { ethers } from 'ethers';

// interface PlayerScore {
//   address: string;
//   score: number;
// }

// const Leaderboard: React.FC = () => {
//   const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);

//   // Example: Contract ABI and Address (replace with actual values)
//   const contractABI = [
//     // Add the function ABI for bestAdresses and bestScores
//     "function bestAdresses() view returns (address[])",
//     "function bestScores() view returns (uint256[])"
//   ];
//   const contractAddress = 'YOUR_CONTRACT_ADDRESS';

//   useEffect(() => {
//     const fetchScores = async () => {
//       try {
//         // Connect to Ethereum provider (MetaMask, Infura, etc.)
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         await provider.send("eth_requestAccounts", []); // Request user's wallet connection

//         const signer = provider.getSigner();
//         const contract = new ethers.Contract(contractAddress, contractABI, signer);

//         // Fetch the best addresses and scores from the contract
//         const addresses: string[] = await contract.bestAdresses();
//         const scores: number[] = await contract.bestScores();

//         // Combine addresses and scores into playerScores array
//         const scoresData = addresses.map((address, index) => ({
//           address,
//           score: scores[index]
//         }));

//         setPlayerScores(scoresData);
//       } catch (error) {
//         console.error('Error fetching scores:', error);
//       }
//     };

//     fetchScores();
//   }, []);

//   return (
//     <div className="leaderboard">
//       <h2 className="title">Leaderboard</h2>
//       <div className="scoreContainer">
//         {playerScores.map((player, index) => (
//           <div key={index} className={`scoreItem rank${index + 1}`}>
//             <span>{index + 1}. </span>
//             <span>{player.address}</span>
//             <span> - Score: {player.score}</span>
//           </div>
//         ))}
//       </div>

//       {/* Add an image below the scores */}
//       <div className="imageContainer">
//         <img src="/kibu-trophy.png" alt="Leaderboard Icon" className="image" />
//       </div>

//       <style jsx>{`
//         @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

//         .leaderboard {
//           width: 33vw;
//           height: 52vh;
//           border: 1px solid #ddd;
//           border-radius: 20px;
//           box-shadow: 0 2px 8px rgba(4, 0, 255, 0.4);
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           padding: 10px;
//           overflow: hidden;
//           background-image: url('/stala.png');
//           background-size: cover;
//           background-position: center;
//           background-repeat: no-repeat;
//         }

//         .title {
//           font-family: 'Press Start 2P';
//           color: rgb(255, 255, 255);
//           text-align: center;
//           margin: 10px 0;
//           font-size: 28px;
//         }

//         .scoreContainer {
//           font-family: 'Ubuntu';
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           width: 100%;
//           flex-grow: 1;
//         }

//         .scoreItem {
//           margin: 7px 0;
//           font-size: 16px;
//           padding: 10px;
//           border-radius: 16px;
//           width: 80%;
//           text-align: center;
//         }

//         .rank1 {
//           background-color: rgb(255, 184, 5);
//         }

//         .rank2 {
//           background-color: rgb(211, 211, 211);
//         }

//         .rank3 {
//           background-color: #cd7f32;
//         }

//         .imageContainer {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           margin-top: 10px;
//         }

//         .image {
//           margin-bottom: 5vh;
//           max-width: 120px;
//           height: auto;
//         }

//         @media (max-height: 600px) {
//           .leaderboard {
//             height: 70vh;
//             margin-top: 10vh;
//           }

//           .scoreItem {
//             font-size: 14px;
//           }

//           .image {
//             max-width: 80px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Leaderboard;
