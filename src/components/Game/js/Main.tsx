import React, { useEffect } from 'react';
import Game from './Game'; // Adjust the import based on your file structure

const FlappyBird: React.FC = () => {
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let gGame: Game | null = null;
  let clicked = false;

  useEffect(() => {
    const handleGameOver = async (score: number) => {
      console.log("FUCK YOUUUUU AHAHHA I SEE YOU DEV ");
  };
    canvas = document.getElementById('game_canvas') as HTMLCanvasElement;
    if (canvas) {
      ctx = canvas.getContext('2d');
      gGame = new Game(ctx, handleGameOver);
      gGame.init();

      const handleMouseDown = () => { clicked = true; };
      const handleMouseUp = () => { clicked = false; };
      const handleTouchStart = () => { clicked = true; };
      const handleTouchCancel = () => { clicked = false; };

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchcancel', handleTouchCancel);

      const intervalId = setInterval(loop, 50);

      return () => {
        clearInterval(intervalId);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchcancel', handleTouchCancel);
      };
    }
  }, []);

  const loop = () => {
    if (gGame) {
      gGame.update(clicked);
      gGame.render();
    }
  };

  return (
    <canvas id="game_canvas" width={288} height={512} style={{ border: '1px solid #c3c3c3' }} />
  );
};

export default FlappyBird;
function handleGameOver(score: number): void {
  throw new Error('Function not implemented.');
}

