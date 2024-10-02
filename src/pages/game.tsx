import { useEffect, useState } from 'react';
import AlertDialog from '../components/game-dialog';
import { NextPage } from 'next';
import FlappyBirdGame from 'components/Game/flappyBird';
import Leaderboard from 'components/leaderboard';
import MyTimer from 'components/timer';
import { ethers } from 'ethers';
import { getContractInstance } from 'config/contract';

const Game: NextPage = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [expiryTimestamp, setExpiryTimestamp] = useState<Date | null>(null);
    const [loadingClaim, setLoadingClaim] = useState<boolean>(false);
    const [claimError, setClaimError] = useState<string | null>(null);

    // Function to call the smart contract and get the timestamp
    const fetchExpiryTimestamp = async () => {
        try {
            const contract = await getContractInstance();
            const timestamp = await contract.lastDistributionTime();
            const ll = timestamp.toNumber() + 604800; // Add 1 week

            // Convert the timestamp to a Date object
            const expiryDate = new Date(ll * 1000); // Convert UNIX timestamp to JavaScript Date

            setExpiryTimestamp(expiryDate);
        } catch (error) {
            console.error('Error fetching timestamp:', error);
        }
    };

    // Function to handle claim action
    const handleClaim = async () => {
        setLoadingClaim(true);
        setClaimError(null); // Reset error message

        try {
            const contract = await getContractInstance();
            const tx = await contract.claimReward(); // Assuming there's a claim function in your contract
            await tx.wait(); // Wait for the transaction to be mined

            // Optionally, re-fetch the expiry timestamp after claiming
            fetchExpiryTimestamp();
        } catch (error) {
            console.error('Error claiming rewards:', error);
            setClaimError('Failed to claim rewards. Please try again.');
        } finally {
            setLoadingClaim(false);
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
                backgroundImage: 'url("/uni-bg.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                userSelect: 'none',
            }}
        >
            {/* Leaderboard Section */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    userSelect: 'none',
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
                {expiryTimestamp ? (
                    <MyTimer expiryTimestamp={expiryTimestamp} />
                ) : (
                    <div>Loading timer...</div>
                )}

                {/* Claim Button */}
                <button
                    onClick={handleClaim}
                    disabled={loadingClaim}
                    style={{
                        marginTop: '20px',
                        padding: '15px 20px',
                        fontSize: '16px',
                        cursor: loadingClaim ? 'not-allowed' : 'pointer',
                        backgroundColor: 'rgb(34, 198, 248)', // Green when active
                        color: 'white',
                        border: '3px solid white',
                        borderRadius: '10px',
                        fontFamily: "'Press Start 2P', cursive",
                        boxShadow: '0 2px 12px rgba(34, 198, 248, 1)',
                    }}
                >
                    {loadingClaim ? 'Claiming...' : 'Claim Rewards'}
                </button>

                {/* Claim Error Message */}
                {claimError && (
                    <div style={{ color: 'red', marginTop: '10px' }}>{claimError}</div>
                )}
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

            {/* Alert Dialog */}
            <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};

export default Game;
