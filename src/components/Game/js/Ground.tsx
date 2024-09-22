class Ground {
    private sX: number;
    private time: number;
  
    constructor() {
      this.sX = 0;
      this.time = 0;
    }
  
    drawGround(ctx: CanvasRenderingContext2D, images: { [key: string]: HTMLImageElement }, over: boolean) {
      this.time++;
      if (!over) this.sX += 1.6;
  
      ctx.drawImage(images["groundImg"], this.sX, 0, 288, 112, 0, 400, 288, 112);
      if (this.sX >= 48) this.sX = 0;
    }
  }
  
  export default Ground;
  