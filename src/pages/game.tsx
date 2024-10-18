import { useEffect, useState } from 'react';
import AlertDialog from '../components/game-dialog';
import { NextPage } from 'next';
import FlappyBirdGame from 'components/Game/flappyBird';
import Leaderboard from 'components/leaderboard';
import MyTimer from 'components/timer';
import { getContractInstance } from 'config/contract';

const Game: NextPage = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isContractReady, setIsContractReady] = useState<boolean>(false);

    useEffect(() => {
        const initializeContract = async () => {
            try {
                const contract = await getContractInstance();
                if (contract) {
                    setIsContractReady(true);
                }
            } catch (error) {
                console.error('Error initializing contract:', error);
            }
        };

        initializeContract(); // Ensure the contract is initialized before making calls
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: '0 5vw',
                backgroundImage: 'url("/uni-bg.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                userSelect: 'none',
            }}
        >
            {/* Leaderboard Section */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', userSelect: 'none' }}>
                <Leaderboard />
            </div>
            {/* Timer Section */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    margin: '0 3vw',
                    textAlign: 'center',
                    userSelect: 'none',
                }}
            >
                <h2
                    style={{
                        marginBottom: '10px',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '24px',
                        color: 'black',
                        textShadow: '0 2px 8px rgb(34, 198, 248)',
                        userSelect: 'none',
                    }}
                >
                    Next distribution in:
                </h2>
                <MyTimer />
            </div>

            {/* Flappy Bird Game Section */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    marginTop: '7vh',
                }}
            >
                <FlappyBirdGame />
            </div>

            <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};

export default Game;
