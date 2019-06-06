export default class Instructions extends Phaser.Scene {
  constructor() {
    super({ key: "Instructions" });
  }

  init(data) {
  }

  create() {

    this.makeBackground();
    this.makeText()
  }

  makeBackground() {
    // Making a background real quick
    this.add.graphics()
    .fillStyle(this.game.config.backgroundColor.color, 0.9)
    .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height)

    // The box to hold our text items
    this.box = this.add.graphics()
    .fillStyle(0xcccccc, 1)
    .fillRoundedRect(0, 0, this.cameras.main.width * .9, this.cameras.main.height * .62)
    .setPosition(this.cameras.main.width * .05, this.cameras.main.height * .2)

    // Title Text  ... After the background and box are made so it renders on top
    this.add.bitmapText(this.cameras.main.width * 0.5, this.box.y - 80, 'chunq', 'Instructions')
    .setFontSize(100)
    .setOrigin(0.5,1)
  }

  makeText() {
    // The Instruction Text
    var instructionText = this.add.bitmapText(this.box.x + 10, this.box.y + 50, 'chunq', '- Pick a numbered Block \n\n- Move the block in a \nstright line to an empty \nspace \n\n- The number on the \nblock says how far it \ncan move.')
    .setTint(0x333333)
    .setFontSize(48)
    .setLetterSpacing(3)
    .setInteractive()

    this.add.sprite(this.cameras.main.width * 0.5, instructionText.y + instructionText.height + 10, 'demo')
    .setOrigin(0.5, 0)
    .setScale(2)

    // Our Home button
    this.add.sprite(this.cameras.main.width * 0.5, this.cameras.main.height * 0.82, 'return')
    .setOrigin(0.5, 0)
    .setScale(2.5)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('Menu')
    })
  }
}
