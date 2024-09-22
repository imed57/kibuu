import React, { useEffect, useRef } from 'react';
import { loadImages } from './js/MediaLoader';
import Game from './js/Game';

const FlappyBirdGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let gGame: Game | null = null;
    let clicked = false;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        gGame = new Game(ctx);

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
            setInterval(loop, 50);
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

    return (
        <canvas
            ref={canvasRef}
            id="game_canvas"
            width="288"
            height="512"
            style={{ border: '1px solid #c3c3c3' }}
        />
    );
};

export default FlappyBirdGame;
