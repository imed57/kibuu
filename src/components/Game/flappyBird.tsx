import React, { useEffect, useRef, useState } from 'react';
import { loadImages } from './js/MediaLoader';
import Game from './js/Game';
import { Contract, ethers, providers } from 'ethers'; // Import ethers
import { getContractInstance } from 'config/contract';
import detectEthereumProvider from '@metamask/detect-provider';

const TtokenABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const FlappyBirdGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDialogVisible, setDialogVisible] = useState(true); // Modal state
    const [isTokenBurned, setTokenBurned] = useState(false); // Track if token was burned
    const [balance, setBalance] = useState<string | null>(null); // State to store balance
    let gGame: Game | null = null;
    let clicked = false;

    useEffect(() => {
        const getTokenBalance = async () => {
            try {
                const ethereumProvider = await detectEthereumProvider();
                if (ethereumProvider) {
                    const web3Provider = new providers.Web3Provider(ethereumProvider as any);
                    const signer = web3Provider.getSigner();
                    const userAddress = await signer.getAddress();

                    const tokenContract = new Contract(
                        '0xFe525B70d7846FD850a86dCC5728C902ab7C972C', // Your contract address
                        TtokenABI,
                        signer
                    );

                    const balance = await tokenContract.balanceOf(userAddress);
                    const formattedBalance = ethers.utils.formatUnits(balance, 18); // Adjust decimals
                    const rara = parseFloat(formattedBalance).toFixed(2)
                    setBalance(rara);
                }
            } catch (error) {
                console.error('Error fetching token balance:', error);
            }
        };

        getTokenBalance(); // Fetch the balance on component mount
    }, []);
    useEffect(() => {
        if (!isTokenBurned) return; // Prevent game initialization if token not burned

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Define the callback to handle the game over event
        const handleGameOver = async (score: number) => {
            console.log("Game Over! Final Score:", score);
            await submitScore(score); // Call the function to submit the score
            // Redisplay the dialog after score submission
            setTokenBurned(false);
            setDialogVisible(true); // Close the dialog
        };

        const initializeGame = async () => {
            gGame = new Game(ctx, handleGameOver); // Pass the callback to the Game constructor

            // Load images
            const sources = {
                BGI: '/images/BGI.png',
                birdImg: '/images/bird.png',
                groundImg: '/images/ground.png',
                bot: '/images/bot.png',
                top: '/images/top.png',
            };

            loadImages(sources).then(() => {
                gGame!.init();
                const intervalId = setInterval(loop, 50); // Control game loop speed

                // Cleanup interval when component unmounts
                return () => clearInterval(intervalId);
            }).catch(error => {
                console.error(error);
            });
        };

        initializeGame(); // Initialize game logic

        const handleMouseDown = () => { clicked = true; };
        const handleMouseUp = () => { clicked = false; };
        const handleTouchStart = () => { clicked = true; };
        const handleTouchCancel = () => { clicked = false; };

        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("touchstart", handleTouchStart);
        canvas.addEventListener("touchcancel", handleTouchCancel);

        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("touchstart", handleTouchStart);
            canvas.removeEventListener("touchcancel", handleTouchCancel);
        };
    }, [isTokenBurned]); // Re-run effect when token is burned

    const loop = () => {
        if (gGame) {
            gGame.update(clicked); // Pass clicked state to update
            gGame.render();
        }
    };

    const burnTokens = async () => {
        try {
            const ethereumProvider = await detectEthereumProvider();
            if (ethereumProvider) {
                const web3Provider = new providers.Web3Provider(ethereumProvider as any);
                const signer = web3Provider.getSigner();
                const userAddress = await signer.getAddress();

                const tokenContract = new Contract(
                    '0xFe525B70d7846FD850a86dCC5728C902ab7C972C', // Your contract address
                    TtokenABI,
                    signer
                );

                // Specify the amount of tkibu tokens to burn
                const amountToBurn = ethers.utils.parseUnits("1", 18); // Adjust decimals as necessary

                const tx = await tokenContract.burnTtoken(amountToBurn); // Call the burn function
                await tx.wait(); // Wait for the transaction to be mined
                console.log("Tokens burned successfully!");

                // After successful token burn, hide the modal and start the game
                setTokenBurned(true);
                setDialogVisible(false); // Close the dialog
            }
        } catch (error) {
            console.error('Error burning tokens:', error);
        }
    };

    const submitScore = async (score: number) => {
        try {
            const contract = await getContractInstance();
            if (contract) {
                const ethereumProvider = await detectEthereumProvider();
                const web3Provider = new providers.Web3Provider(ethereumProvider);
                const signer = web3Provider.getSigner();
                const userAddress = await signer.getAddress();


                const tx = await contract.submitScore(score);
                await tx.wait(); // Wait for the transaction to be mined
            }
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Modal Dialog for Burning Token */}
            {isDialogVisible && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '1vh',
                    alignItems: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                }}>
                    <h1 style={{ color: 'white', marginBottom: '20px' }}>tKibu balance: {balance}</h1>

                    <button onClick={burnTokens} style={{
                        width: '80%',
                        padding: '10px 20px',
                        backgroundColor: 'rgb(34, 198, 248)',
                        color: 'white',
                        border: '3px solid white',
                        fontSize: '14px',
                        borderRadius: '10px',
                        fontFamily: "'Press Start 2P', cursive",
                        boxShadow: '0 2px 12px rgba(34, 198, 248, 1)',
                        cursor: 'pointer'
                    }}>
                        Burn Token & Start Game
                    </button>
                </div>
            )}

            {/* Game Canvas */}
            <canvas
                ref={canvasRef}
                id="game_canvas"
                width="288"
                height="512"
                style={{
                    border: '3px solid #ddd',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(34, 198, 248, 0.7)',
                }}
            />
        </div>
    );
};

export default FlappyBirdGame;