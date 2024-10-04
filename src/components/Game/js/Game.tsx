import Bird from './Bird';
import Ground from './Ground';
import { loadImages, images } from './MediaLoader';
import Block from './Block';

class Game {
    private ctx: CanvasRenderingContext2D;
    private birdOb: Bird | null;
    private groundOb: Ground | null;
    private blockOb: Block[];
    private touchGround: boolean;
    private start: boolean;
    private over: boolean;
    private clicked: boolean;
    private rotSpeed: number;
    private score: number;
    private gameLoopIntervalId: number | null; // Track interval ID
    private sources: { [key: string]: string };
    private gameOverCallback: (score: number) => void; // Callback for game over
    private gameOverCalled: boolean; // Track if game over has been called

    constructor(context: CanvasRenderingContext2D, gameOverCallback: (score: number) => void) {
        this.ctx = context;
        this.birdOb = null;
        this.groundOb = null;
        this.blockOb = [];
        this.touchGround = false;
        this.start = false;
        this.over = false;
        this.clicked = false;
        this.rotSpeed = 2 * Math.PI / 180;
        this.score = 0;
        this.gameLoopIntervalId = null; // Initialize interval ID tracker
        this.gameOverCallback = gameOverCallback; // Set the callback
        this.gameOverCalled = false; // Initialize game over called tracker

        this.sources = {
            BGI: 'images/BGI.png',
            birdImg: 'images/bird.png',
            groundImg: 'images/ground.png',
            bot: 'images/bot.png',
            top: 'images/top.png'
        };

        window.addEventListener('click', () => {
            this.clicked = true;
        });
    }

    init() {
        this.birdOb = new Bird();
        this.groundOb = new Ground();
        this.blockOb = [];
        this.touchGround = false;
        this.rotSpeed = 2 * Math.PI / 180;
        this.score = 0;
        this.start = false;
        this.over = false;
        this.gameOverCalled = false; // Reset tracker on init

        // Ensure no leftover intervals exist
        if (this.gameLoopIntervalId !== null) {
            clearInterval(this.gameLoopIntervalId);
        }

        this.gameLoopIntervalId = window.setInterval(this.loop.bind(this), 50); // Set interval only once

        // Initialize blocks
        for (let i = 1; i < 5; i++) {
            const block = new Block();
            block.botY = Math.round(150 + Math.random() * 200);
            block.topY = block.botY - 100 - 320;
            block.X = i === 1 ? 400 : this.blockOb[i - 1].X + 144;
            this.blockOb[i] = block;
        }
    }

    update(clicked: boolean) {
        if (this.over && clicked && this.touchGround) {
            this.init();
            return;
        }
    
        for (let i = 1; i < 5; i++) {
            if (this.blockOb[i].X + 52 <= 0) {
                this.blockOb[i].X = i === 1 ? this.blockOb[4].X + 144 : this.blockOb[i - 1].X + 144;
                this.blockOb[i].botY = Math.round(150 + Math.random() * 200);
                this.blockOb[i].topY = this.blockOb[i].botY - 100 - 320;
                this.blockOb[i].passed = false;
            }
        }
    
        if (this.birdOb.bounceSpeed > 0 && this.start) {
            this.rotSpeed = 2 * Math.PI / 180;
            this.birdOb.angle -= 20 * Math.PI / 180; 
            if (this.birdOb.angle <= -30 * Math.PI / 180) {
                this.birdOb.angle = -30 * Math.PI / 180;
            }
        } else if (this.start) {
            this.birdOb.angle += this.rotSpeed; 
            this.rotSpeed += 0.0017;
            if (this.birdOb.angle >= 90 * Math.PI / 180) {
                this.birdOb.angle = 90 * Math.PI / 180;
            }
        }
    
        if (clicked && !this.birdOb.dead && !this.over) {
            this.birdOb.bounceSpeed = 3;
            this.clicked = false;
            this.start = true;
        }
    
        if (this.birdOb.Y - 12.5 + 30 >= 400) {
            this.birdOb.Y = 400 + 12.5 - 30;
            this.touchGround = true;
            this.over = true;
            this.triggerGameOver(); // Call trigger game over only once
        }
    
        for (let n = 1; n < 5; n++) {
            let crash = false;
    
            if (
                (this.birdOb.X - 18 + 32 >= this.blockOb[n].X) &&
                (this.birdOb.X - 18 + 4 <= this.blockOb[n].X + 52) &&
                (this.birdOb.Y - 12.5 + 4 <= this.blockOb[n].topY + 320 ||
                 this.birdOb.Y - 12.5 + 21 >= this.blockOb[n].botY)
            ) {
                this.touchGround = true;
                this.over = true;
                crash = true;
                this.triggerGameOver(); // Call trigger game over only once if crashed
            }
    
            if (!crash && this.birdOb.X > this.blockOb[n].X + 26 && !this.blockOb[n].passed) {
                this.score++;
                this.blockOb[n].passed = true;
            }
        }
    
        if (this.start && !this.over) {
            this.birdOb.Y -= this.birdOb.bounceSpeed; 
            this.birdOb.bounceSpeed -= 0.3; 
            this.touchGround = false;
        }
    }
    
    triggerGameOver() {
        if (!this.gameOverCalled) {
            this.gameOverCalled = true; // Set the tracker
            this.gameOverCallback(this.score); // Call the game over callback
        }
    }

    render() {
      if (images["BGI"]) this.ctx.drawImage(images["BGI"], 0, 0);

      for (let i = 1; i < 5; i++) {
        this.blockOb[i]?.drawBlock(this.ctx, images, this.over, this.start);
      }
      this.groundOb?.drawGround(this.ctx, images, this.over);
      this.birdOb?.drawBird(this.ctx, images, this.over, this.start);
  
      if (!this.start) {
        this.ctx.font = "20px Impact";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Click to start!", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
      }
  
      // Display score
      this.ctx.font = "40px Impact";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "white";
      this.ctx.fillText(this.score.toString(), this.ctx.canvas.width / 2, 100);
  
      // Display "Game Over" message
      if (this.over && this.touchGround) {
        this.ctx.font = "40px Impact";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("GAME OVER!", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        this.ctx.font = "20px Impact";
        this.ctx.fillText("Click to restart!", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 40);
      }
    }

    loop() {
      if (!this.over) {
        this.update(this.clicked);
        this.render();
      } else if (this.clicked && this.touchGround) {
        // If clicked and game is over, restart the game
        this.init();
        this.clicked = false; // Reset clicked state
      }
      // Reset clicked state after processing
      this.clicked = false;
    }
}

export default Game;
