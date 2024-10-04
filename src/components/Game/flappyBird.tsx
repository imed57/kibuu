import React, { useEffect, useRef } from 'react';
import { loadImages } from './js/MediaLoader';
import Game from './js/Game';
import { ethers } from 'ethers'; // Import ethers
import { getContractInstance } from 'config/contract';

const FlappyBirdGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let gGame: Game | null = null;
    let clicked = false;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Define the callback to handle the game over event
        const handleGameOver = async (score: number) => {
            console.log("Game Over! Final Score:", score);
            await submitScore(score); // Call the function to submit the score
        };

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
    }, []);

    const loop = () => {
        if (gGame) {
            gGame.update(clicked); // Pass clicked state to update
            gGame.render();
        }
    };

    const submitScore = async (score: number) => {
        // Connect to Ethereum network (update provider URL as needed)
        try {
            const contract = await getContractInstance();
            if (contract) {
                const tx = await contract.submitScore(score);
                await tx.wait(); // Wait for the transaction to be mined
            }
        } catch (error) {
            console.error('Error claiming rewards:', error);
        }
    };

    return (
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
    );
};

export default FlappyBirdGame;
