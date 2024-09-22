import { useState } from 'react';
import AlertDialog from '../components/game-dialog';
import { NextPage } from 'next';
import FlappyBirdGame from 'components/Game/flappyBird';
import Leaderboard from 'components/leaderboard';

const Game: NextPage = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '0 5vw', // Add some padding for smaller screens
        }}>
            {/* Leaderboard Section */}
            <div style={{
                flex: 1, 
                display: 'flex',
                justifyContent: 'flex-start',
                marginRight: '5vw', // Space between leaderboard and game
            }}>
                <Leaderboard />
            </div>

            {/* Flappy Bird Game Section */}
            <div style={{
                flex: 2, // Allow the game to take more space
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <FlappyBirdGame />
            </div>

            {/* Alert Dialog */}
            <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};

export default Game;
