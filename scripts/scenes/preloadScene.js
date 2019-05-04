import { SOURCES } from '../gameConfig.js'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    // Just a white square we'll tint as needed
    // Maybe later figure out how to not load an extrenal file and
    // use Geom to make a square
    
    this.load.image('tile', '../assets/img/tile.png')
    this.load.image('restart', '../assets/img/restart.png')

    /**
     * Lock the RNG seed to today's formated date so it's
     * the same for everyone on any day
     */
    Phaser.Math.RND.sow( new Date().toISOString().slice(0, 10) )
  }

  create() {
    this.scene.start('MainScene')
  }
}
