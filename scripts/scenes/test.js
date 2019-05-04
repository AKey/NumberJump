import AlignGrid from '../objects/AlignGrid.js'

export default class Test extends Phaser.Scene {
  constructor() {
    super({ key: "Test" });
  }

  preload() {
    // Use this to load in the logo and any assets needed for the PreloadScene

    this.load.image("phaser-logo", "./assets/img/phaser-logo.png");
  }

  create() {
    var gridConfig = {
      scene: this,
      cols: 5,
      rows: 5
    };
    this.aGrid = new AlignGrid(gridConfig);

    this.aGrid.showNumbers();

    this.logo = this.add.image(50, 50, "phaser-logo");

    this.aGrid.placeAtIndex(8, this.logo);
  }
}