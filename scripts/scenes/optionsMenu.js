import { gameOptions } from "../gameConfig.js";

export default class optionsMenu extends Phaser.Scene {
  constructor() {
    super({ key: "optionsMenu" });
  }

  init(data) {
  }

  create() {

    this.makeBackground();
    this.makeButtons()
  }

  makeBackground() {
    // Making a background real quick
    this.add.graphics()
    .fillStyle(this.game.config.backgroundColor.color, 0.9)
    .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height)

    // The box to hold our text items
    this.box = this.add.graphics()
    .fillStyle(0xcccccc, 1)
    .fillRoundedRect(0, 0, this.cameras.main.width * .9, this.cameras.main.height * .5)
    .setPosition(this.cameras.main.width * .05, this.cameras.main.height * .2)

    // Title Text
    this.add.bitmapText(this.cameras.main.width * 0.5, this.box.y - 20, 'chunq', 'Game Options')
    .setFontSize(100)
    .setOrigin(0.5,1)
  }

  resetScores() {
    // Just resets our localStorage to a null point
    var today = new Date().toISOString().slice(0, 10);
    var savedData = {
      date: today,
      standard: [],
      daily: []
    }

    localStorage.setItem(gameOptions.localStorageName, JSON.stringify(savedData));
  }

  makeButtons() {
    // Score Reset Text Button
    var resetText = this.add.bitmapText(this.box.x + 30, this.box.y + 110, 'chunq', 'Reset High Scores')
    .setTint(0x22a6b3)
    .setFontSize(65)
    .setLetterSpacing(2.5)
    .setInteractive()
    .on('pointerdown', () => {
      this.resetScores();
      resetText.setTint(0xAAAAAA)
    }, this);

    // Our Home button
    this.add.sprite(this.cameras.main.width * 0.5, this.cameras.main.height * 0.72, 'return')
    .setOrigin(0.5, 0)
    .setScale(2.5)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('Menu')
    })
  }
}