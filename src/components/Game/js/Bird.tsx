import { Sound } from './MediaLoader';

class Bird {
  private sX: number;
  public X: number;
  public Y: number;
  private time: number;
  private frame: number;
  public bounceSpeed: number;
  public angle: number;
  public dead: boolean;
  private hitSound: Sound;
  private hitGroundSound: Sound;
  public hitPlayed: boolean;
  public hitGroundPlayed: boolean;

  constructor() {
    this.sX = 0;
    this.X = 75;
    this.Y = 150;
    this.time = 0;
    this.frame = 0;
    this.bounceSpeed = 0;
    this.angle = 0;
    this.dead = false;

    this.hitSound = new Sound("sounds/sfx_hit.mp3");
    this.hitPlayed = false;
    this.hitGroundSound = new Sound("sounds/sfx_hitGround.mp3");
    this.hitGroundPlayed = false;
  }

  swing() {
    const swingSound = new Sound("sounds/sfx_wing.mp3");
    swingSound.play();
  }

  drawBird(ctx: CanvasRenderingContext2D, images: { [key: string]: HTMLImageElement }, touchGround: boolean, start: boolean) {
    this.time += 10;
    this.sX = 36 * this.frame;

    if (!touchGround && start) {
      this.Y -= this.bounceSpeed;
      this.bounceSpeed -= 0.35;
    }

    ctx.save();
    ctx.translate(this.X, this.Y);
    ctx.rotate(this.angle);
    ctx.drawImage(images["birdImg"], this.sX, 0, 36, 25, -18, -12.5, 36, 25);
    ctx.restore();

    if (this.time >= 60) {
      this.frame++;
      this.time = 0;
    }
    if (this.frame > 2) {
      this.frame = 0;
    }
  }
}

export default Bird;
