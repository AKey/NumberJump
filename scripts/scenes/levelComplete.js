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
    // Dull out the background
    this.add.graphics()
    .fillStyle(0x00b894, 0.9)
    .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height)

    // The box to hold our text items
    var box = this.add.graphics()
    .fillStyle(0xffffff, 1)
    .fillRoundedRect(0, 0, this.cameras.main.width * .8, this.cameras.main.height * .8)
    .setPosition(this.cameras.main.width * .1, this.cameras.main.height * .1)

    // Congrats Text
    this.add.bitmapText(this.cameras.main.width * 0.5, box.y, 'chunq', 'Level Complete!')
    .setFontSize(72)
    .setOrigin(0.5,1)

    // Level Text
    let levelText = this.add.bitmapText(this.cameras.main.width * 0.5, box.y + 80, 'chunq', 'Level - ' + (this.level + 1))
    .setFontSize(64)
    .setOrigin(0.5,0)
    .setTint(0x718093)

    // Lots of goodness here to make our timer pretty
    let minutes = Math.floor(this.time / 60);
    let seconds = this.time - minutes * 60
    let finalTime = ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2)

    // Time Text
    this.add.bitmapText(levelText.x , levelText.y + levelText.height * 1.5, 'chunq', 'Time - ' + finalTime)
    .setFontSize(64)
    .setOrigin(0.5,0)
    .setTint(0x718093)

    // Next Level
    this.add.bitmapText(levelText.x , levelText.y + levelText.height * 5, 'chunq', 'Next Level')
    .setFontSize(64)
    .setOrigin(0.5,0)
    .setTint(0x0097e6)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('MainScene', {level: this.level + 1, mode: this.mode})
    })

    // Retry
    this.add.bitmapText(levelText.x , levelText.y + levelText.height * 12, 'chunq', 'Retry')
    .setFontSize(64)
    .setOrigin(0.5,0)
    .setTint(0xf0932b)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('MainScene', {level: this.level, mode: this.mode})
    })

    // Home
    this.add.bitmapText(levelText.x , levelText.y + levelText.height * 8, 'chunq', 'Home')
    .setFontSize(64)
    .setOrigin(0.5,0)
    .setTint(0x8c7ae6)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('Menu')
    })
  }
}