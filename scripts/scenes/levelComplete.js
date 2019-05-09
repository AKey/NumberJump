import { gameOptions } from "../gameConfig.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "levelComplete" });
  }

  init(data) {
    this.level = data.level;
    this.time = data.time;
    this.mode = data.mode;
  }

  create() {

    this.makeBackground();
    this.checkScores();
    this.showStats();
    this.makeButtons();
  }

  makeBackground() {
    // Build our backgound, box, and title text
    // Setting a background color
    this.add.graphics()
    .fillStyle(0x00b894, 0.9)
    .fillRoundedRect(0, 0, this.cameras.main.width, this.cameras.main.height)

    // The box to hold our text items
    var box = this.add.graphics()
    .fillStyle(0xffffff, 1)
    .fillRoundedRect(0, 0, this.cameras.main.width * .8, this.cameras.main.height * .5)
    .setPosition(this.cameras.main.width * .1, this.cameras.main.height * .15)

    // Congrats Text, tile bar
    this.add.bitmapText(this.cameras.main.width * 0.5, box.y, 'chunq', 'Level Complete!')
    .setFontSize(72)
    .setOrigin(0.5,1)
  }

  checkScores() {
    // Get our scores from the local storage
    this.savedData = JSON.parse(localStorage.getItem(gameOptions.localStorageName))

    // Current highscore is blank or we finished faster
    if ( this.savedData[this.mode][this.level] == null || this.time < this.savedData[this.mode][this.level] ) {

      this.newHigh = true;    // A flag for indicating our new High Score
      this.savedData[this.mode][this.level] = this.time;  // Modify our JSON representation of the localStorage string

      // Update the saved copy on the client
      localStorage.setItem(gameOptions.localStorageName, JSON.stringify(this.savedData))
    }
  }

  showStats() {

    // Level Text
    this.levelText = this.add.bitmapText(this.cameras.main.width * 0.5, this.cameras.main.height * .25, 'chunq', 'Level - ' + (this.level + 1))
    .setFontSize(64)
    .setOrigin(0.5,0)
    .setTint(0x718093)

    let finalTime = this.secondsToTime(this.time)

    // Time Text
    var timeText = this.add.bitmapText(this.levelText.x , this.levelText.y + this.levelText.height * 2, 'chunq', 'Time - ' + finalTime)
    .setFontSize(64)
    .setOrigin(0.5,0)
    .setTint(0x718093)

    if (this.newHigh) {
      timeText.setTint(0xeb2f06)
      .setFontSize(70)

      // Make some text to tell the player they set a new best
      var newRecordText = this.add.bitmapText(timeText.x, timeText.y, 'chunq', 'NEW RECORD!')
      .setOrigin(0.5, 1)
      .setFontSize(50)
      .setTint(0xEE5A24)

      // Make the new best indicator blink
      this.tweens.add({
        targets: newRecordText,
        alpha: 0.5,
        duration: 1000,
        repeat: -1,
        yoyo: true
      })
    } else {  // Show the old best time
      let bestTime = this.secondsToTime(this.savedData[this.mode][this.level])

      var newRecordText = this.add.bitmapText(timeText.x, timeText.y + timeText.height, 'chunq', 'Best:  ' + bestTime)
      .setOrigin(0.5, 0)
      .setFontSize(50)
      .setTint(0xB53471)
      
    }
  }

  makeButtons() {
  // Next Puzzle
  var nextSprite = this.add.sprite(this.cameras.main.width * 0.5 , this.cameras.main.height * .7, 'forward')
    .setOrigin(0.5, 0)
    .setScale(2)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('MainScene', {level: this.level + 1, mode: this.mode})
    })

    // Our restart button
    this.add.sprite(nextSprite.x - nextSprite.width * 3, nextSprite.y, 'return')
      .setOrigin(0.5, 0)
      .setScale(2)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('MainScene', {level: this.level, mode: this.mode})
      })
      
      // Our Home button
      this.add.sprite(nextSprite.x + nextSprite.width * 3, nextSprite.y, 'home')
      .setOrigin(0.5, 0)
      .setScale(2)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Menu')
      })
  }

  secondsToTime(time){
        // Lots of goodness here to make our timer pretty
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60
        return ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2)
  }
}