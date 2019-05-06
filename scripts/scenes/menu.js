import { gameOptions } from "../gameConfig.js";

export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "Menu" });
  }

  preload() {

  }
  
  create() {
    var title = this.add.text(this.cameras.main.width * 0.5, 100, 'Number Jumper', {
      fontSize: '80px',
      fill: '#DDD'
    })
    .setOrigin(0.5)

    var btnStandard = this.add.text(20, 400, 'Original Levels', {
      fontSize: '60px',
      fill: '#0f0'
    })
    .setInteractive()
    .on('pointerdown', () => { 
      this.scene.start("MainScene", {mode: 'standard'}); 
    })
    
    var btnDaily = this.add.text(20, 550, 'Daily Levels', {
      fontSize: '64px',
      fill: '#0f0'})
    .setInteractive()
    .on('pointerdown', () => { 
      gameOptions.randomLevels = []
      this.scene.start("MainScene", {mode: 'daily'}); 
    })

    /**
     * This is for later versions
     */
    // var btnBonus = this.add.text(20, 700, 'Bonus Levels', {
    //   fontSize: '64px',
    //   fill: '#0f0'})
    // .setInteractive()
    // .on('pointerdown', () => { 
    //   // Set the RNG and clear pre-calculated random levels before starting the game
    //   Phaser.Math.RND.sow( new Date().toUTCString().slice(0, 15) )
    //   gameOptions.randomLevels = []
    //   this.scene.start("MainScene", {randomMode: true}); 
    // })
    
    // this.scene.start("MainScene", {randomMode: false, level: 10})
  }
}
