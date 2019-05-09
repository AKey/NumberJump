import { gameOptions } from "../gameConfig.js";

export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "Menu" });
  }

  preload() {

  }
  
  create() {

    // Game Title
    this.add.bitmapText(this.cameras.main.width * 0.5, this.cameras.main.height * 0.2, 'chunq', 'Number \n     Jumper')
    .setFontSize(120)
    .setOrigin(0.5)

    // First game option
    let btnOriginal = this.add.bitmapText(this.cameras.main.width * 0.05, this.cameras.main.height * 0.4, 'chunq', 'Original Levels')
    .setTint(0x6c5ce7)
    .setFontSize(64)
    .setInteractive()
    .on('pointerdown', () => { 
      this.scene.start("MainScene", {mode: 'standard'}); 
    })

    // Sub text
    this.add.bitmapText(btnOriginal.x * 5, btnOriginal.y + btnOriginal.fontSize, 'chunq', 'The Original 10 levels')
    // .setTint(0x6c5ce7)
    .setFontSize(32)


    // Second Game Option
    let btnDaily = this.add.bitmapText(this.cameras.main.width * 0.05, this.cameras.main.height * 0.55, 'chunq', 'Daily Levels')
    .setTint(0xbadc58)
    .setFontSize(64)
    .setInteractive()
    .on('pointerdown', () => { 
      gameOptions.randomLevels = []
      this.scene.start("MainScene", {mode: 'daily'}); 
    })

     // Sub text
     this.add.bitmapText(btnDaily.x * 5, btnDaily.y + btnDaily.fontSize, 'chunq', '10 Fresh Daily Levels')
     // .setTint(0x6c5ce7)
     .setFontSize(32)

     this.getScores()
  }

  // Used to load our highscores, make a new entry, and reset old scores
  getScores() {
    var today = new Date().toISOString().slice(0, 10);
    var savedData = localStorage.getItem(gameOptions.localStorageName) == null ? {
      date: today,
      standard: [],
      daily: []
    } : JSON.parse(localStorage.getItem(gameOptions.localStorageName));

    // Scores are from a different date. Wipe them
    if (savedData.date !== today) {
      savedData.date = today;
      savedData.daily = [];
    }

    localStorage.setItem(gameOptions.localStorageName, JSON.stringify(savedData));
  }
}
