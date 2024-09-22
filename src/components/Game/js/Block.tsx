class Block {
    public X: number;
    public botY: number;
    public topY: number;
    public time: number;
    public passed: boolean;
  
    constructor() {
      this.X = 300;
      this.botY = 0;
      this.topY = 0;
      this.time = 0;
      this.passed = false;
    }
  
    drawBlock(ctx: CanvasRenderingContext2D, images: { [key: string]: HTMLImageElement }, over: boolean, start: boolean) {
      this.time++;
      if (!over && start) {
        this.X -= 1.6;
      }
      ctx.drawImage(images["bot"], this.X, this.botY, 52, 320);
      ctx.drawImage(images["top"], this.X, this.topY, 52, 320);
    }
  }
  
  export default Block;
  