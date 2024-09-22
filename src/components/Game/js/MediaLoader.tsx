export const images: Record<string, HTMLImageElement> = {};

export function loadImages(sources: { [key: string]: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      let loadedImagesCount = 0;
      const totalImages = Object.keys(sources).length;
  
      for (const src in sources) {
        images[src] = new Image();
        images[src].src = sources[src];
  
        images[src].onload = () => {
          loadedImagesCount++;
          if (loadedImagesCount === totalImages) {
            resolve(); // Resolve the promise when all images are loaded
          }
        };
  
        images[src].onerror = () => {
          reject(new Error(`Failed to load image: ${src}`));
        };
      }
    });
  }

export class Sound {
    private sound: HTMLAudioElement;

    constructor(src: string) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play(): void {
        this.sound.play();
    }

    stop(): void {
        this.sound.pause();
    }
}
