export default class AlignGrid {
  /**
   * An Alignment grid used to place items or scale the game
   * @constructor
   * @param {object} config - JS object for constructing the grid. MUST include a scene key
   * @example
   *    var grid = new AlignGrid( { 'scene' : this, 'rows' : 3, 'cols' : 3 } )
   */
  constructor(config) {
    if (!config) return console.log("AlignGrid needs a config!!");

    // In general will refer to 'this' in calling scene.
    if (!config.scene) {
      return console.log("AlignGrid has no Scene!");
    }

    if (!config.rows) {
      config.rows = 3;
    }
    if (!config.cols) {
      config.cols = 3;
    }
    if (!config.width) {
      config.width = config.scene.game.config.width;
    }
    if (!config.height) {
      config.height = config.scene.game.config.height;
    }

    this.h = config.height;
    this.w = config.width;
    this.rows = config.rows;
    this.cols = config.cols;
    this.scene = config.scene;

    // cw, cell width, is the frid width divided by numer of columns
    this.cw = this.w / this.cols;
    // ch, cell height, is the grid height divided by the number of rows
    this.ch = this.h / this.rows;
  }

  /**
   * Draws the grid on screen. Mostly for debugging
   * @param {number} alpha - Alpha value of the grid lines. Default 1
   */
  show(a = 1) {
    this.graphics = this.scene.add.graphics();
    this.graphics.lineStyle(4, 0xff0000, a);

    for (var i = 0; i < this.w; i += this.cw) {
      this.graphics.moveTo(i, 0);
      this.graphics.lineTo(i, this.h);
    }
    for (var i = 0; i < this.h; i += this.ch) {
      this.graphics.moveTo(0, i);
      this.graphics.lineTo(this.w, i);
    }
    this.graphics.strokePath();
  }

  /**
   * Place an object in relation to the grid. Zero Indexed
   * @param {number} x - The horizontal grid position of the item
   * @param {number} y - The vertical grid position of the item
   * @param {*} obj - A placable gameObject to be positioned within the grid
   */
  placeAt(x, y, obj) {
    // Calculate the center of the cell by adding half of the height
    // and half of the width to the x and y coordinates
    obj.x = this.cw * x + this.cw * 0.5;
    obj.y = this.ch * y + this.ch * 0.5;
  }

  /**
   * Debug function that shows the grid with a grid number for use with `placeAtIndex()`
   * @param {number} a - Alpha value of numbers in the grid. Default 1
   */
  showNumbers(a = 1) {
    this.show(a);
    var n = 0;
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        var numText = this.scene.add.text(0, 0, n, { color: "red" });
        numText.setOrigin(0.5);
        this.placeAt(j, i, numText);
        n++;
      }
    }
  }

  /**
   * Places the object in a specified Grid Index position. Use `showNumbers()` to see the
   * index of each grid position.
   * @param {number} index - Grid position to place the object
   * @param {*} obj - A placable gameObject to be positioned within the grid
   */
  placeAtIndex(index, obj) {
    let y = Math.floor(index / this.cols);
    let x = index - (y * this.cols);
    this.placeAt(x, y, obj);
  }

  /**
   * Debug method for showing current grid settings in the console
   */
  print() {
    console.log(
      `HEIGHT: ${this.h} | WIDTH: ${this.w} | ROWS: ${this.rows} | COLS: ${
        this.cols
      } | COL-WIDTH: ${this.cw} | COL-HEIGHT: ${this.ch} | CELLS ${this.cols *
        this.rows}`
    );
  }
}
