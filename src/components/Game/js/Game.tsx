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
  private sources: { [key: string]: string };

  constructor(context: CanvasRenderingContext2D) {
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

    this.sources = {
      BGI: 'images/BGI.png',
      birdImg: 'images/bird.png',
      groundImg: 'images/ground.png',
      bot: 'images/bot.png',
      top: 'images/top.png'
    };

    // Add a click event listener to handle game restarts
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

    loadImages(this.sources)
      .then(() => {
        // Start the game loop after images are loaded
        setInterval(this.loop.bind(this), 50);
      })
      .catch((error) => {
        console.error(error);
      });

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
    // Check for game restart
    if (this.over && clicked && this.touchGround) {
      this.init(); // Restart the game
      return; // Exit the update function
    }
  
    // Block movement logic
    for (let i = 1; i < 5; i++) {
      if (this.blockOb[i].X + 52 <= 0) {
        this.blockOb[i].X = i === 1 ? this.blockOb[4].X + 144 : this.blockOb[i - 1].X + 144;
        this.blockOb[i].botY = Math.round(150 + Math.random() * 200);
        this.blockOb[i].topY = this.blockOb[i].botY - 100 - 320;
        this.blockOb[i].passed = false;
      }
    }
  
    // Bird rotation and movement
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
  
    // Handle click to flap
    if (clicked && !this.birdOb.dead && !this.over) {
      this.birdOb.bounceSpeed = 4;
      this.clicked = false;
      this.start = true;
    }
  
    // Check for ground collision
    if (this.birdOb.Y - 12.5 + 30 >= 400) {
      this.birdOb.Y = 400 + 12.5 - 30;
      if (!this.birdOb.hitGroundPlayed) {
        this.birdOb.hitGroundPlayed = true;
      }
      this.touchGround = true;
      this.over = true; // Set game over state
    }
  
    // Check for tube collisions
    for (let n = 1; n < 5; n++) {
      let crash = false;
  
      if (
        (this.birdOb.X - 18 + 32 >= this.blockOb[n].X) &&
        (this.birdOb.X - 18 + 4 <= this.blockOb[n].X + 52) &&
        (this.birdOb.Y - 12.5 + 4 <= this.blockOb[n].topY + 320 ||
         this.birdOb.Y - 12.5 + 21 >= this.blockOb[n].botY)
      ) {
        if (!this.birdOb.hitPlayed) {
          this.birdOb.hitPlayed = true;
        }
        this.touchGround = true;
        this.over = true; // Set game over state
        crash = true; // Collision detected
      }
  
      // Increment score if bird passes block
      if (!crash && this.birdOb.X > this.blockOb[n].X + 26 && !this.blockOb[n].passed) {
        this.score++;
        this.blockOb[n].passed = true;
      }
  
      if (crash) {
        this.over = true; // Set game over state on collision with tube
        this.touchGround = true;
        this.over = true; // Set game over state
      }
    }
  }

  render() {
    // Draw background
    if (images["BGI"]) this.ctx.drawImage(images["BGI"], 0, 0);

    // Draw blocks
    for (let j = 1; j < 5; j++) {
      this.blockOb[j]?.drawBlock(this.ctx, images, this.over, this.start);
    }

    // Draw ground
    this.groundOb?.drawGround(this.ctx, images, this.over);

    // Draw bird
    this.birdOb?.drawBird(this.ctx, images, this.over, this.start);

    // Display "Click to Start" message
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

  private loop() {
    // Only update and render if the game is not over
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
