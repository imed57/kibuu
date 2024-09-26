import { useState } from 'react';
import AlertDialog from '../components/game-dialog';
import { NextPage } from 'next';
import FlappyBirdGame from 'components/Game/flappyBird';
import Leaderboard from 'components/leaderboard';
import MyTimer from 'components/timer';

const Game: NextPage = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: '0 5vw',
                backgroundImage: 'url("/uni-bg.jpg")', // Path to your background image
                backgroundSize: 'cover', // Ensure the image covers the entire viewport
                backgroundPosition: 'center', // Center the background image
                backgroundRepeat: 'no-repeat', // Prevent the image from repeating
            }}
        >
            {/* Leaderboard Section */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginRight: '5vw', // Space between leaderboard and game
                }}
            >
                <Leaderboard />
            </div>
            <div
            style={{ 
                marginRight: '20px',
            }}>
                <MyTimer></MyTimer>
            </div>

            {/* Flappy Bird Game Section */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '7vh', // Space between leaderboard and game
                }}
            >
                <FlappyBirdGame />
            </div>

            {/* Alert Dialog */}
            <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};

export default Game;
