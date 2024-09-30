import { useEffect, useState } from 'react';
import AlertDialog from '../components/game-dialog';
import { NextPage } from 'next';
import FlappyBirdGame from 'components/Game/flappyBird';
import Leaderboard from 'components/leaderboard';
import MyTimer from 'components/timer';
import { ethers } from 'ethers';
import '../config/abis/example.json';

const Game: NextPage = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [expiryTimestamp, setExpiryTimestamp] = useState<Date | null>(null);

    // Function to call the smart contract and get the timestamp
    const fetchExpiryTimestamp = async () => {
        try {
            // const provider = new ethers.providers.Web3Provider(window.ethereum);
            // const signer = provider.getSigner();
            // const contract = new ethers.Contract('contractAddress', 'contractABI', signer);
            // const timestamp = await contract.getExpiryTimestamp();

            // Convert the timestamp to a Date object
            const expiryDate = new Date(1727956140 * 1000); // Convert UNIX timestamp to JavaScript Date
            console.log('Fetched timestamp:', expiryDate);

            setExpiryTimestamp(expiryDate);
        } catch (error) {
            console.error('Error fetching timestamp:', error);
        }
    };

    useEffect(() => {
        fetchExpiryTimestamp(); // Call the function to fetch the timestamp
    }, []);

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
                }}
            >
                <Leaderboard />
            </div>

            {/* Timer Section */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    margin: '0 3vw', // Space between leaderboard and game
                    textAlign: 'center', // Ensure the timer is centered
                }}
            >
                {/* Text Above Timer with 'Press Start 2P' Font */}
                <h2
                    style={{
                        marginBottom: '10px',
                        fontFamily: "'Press Start 2P', cursive", // Apply font
                        fontSize: '24px', // Increase font size
                        color: 'black', // Make the text white
                        textShadow: '0 2px 8px rgb(34, 198, 248)'
                    }}
                >
                    Next distribution in:
                </h2>
                {expiryTimestamp ? (
                    <MyTimer expiryTimestamp={expiryTimestamp} />
                ) : (
                    <div>Loading timer...</div> // Display a message while fetching the timestamp
                )}
            </div>

            {/* Flappy Bird Game Section */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
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
