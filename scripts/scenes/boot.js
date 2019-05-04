export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload() {
    // Use this to load in the logo and any assets needed for the PreloadScene
    // Set the page background to match the game config background for devices where the game does not fill the screen
    document.body.style.backgroundColor = this.game.config.backgroundColor.rgba
  }
  
  create() {
    this.scene.start("PreloadScene");
  }
}
