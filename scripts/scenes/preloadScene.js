import { SOURCES } from '../gameConfig.js'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    // Just a white square we'll tint as needed
    // Maybe later figure out how to not load an extrenal file and
    // use Geom to make a square
    
    this.loadImages()

    // Get our font on
    this.load.setPath('../assets/font');
    this.load.bitmapFont('chunq', 'Chunq.png', 'Chunq.fnt');
  }

  loadImages() {
    this.load.setPath('../assets/img');
    for(let prop in SOURCES.IMAGE) {
      this.load.image(SOURCES.IMAGE[prop]);
    }
  }

  create() {
    this.scene.start('Menu')
  }
}
