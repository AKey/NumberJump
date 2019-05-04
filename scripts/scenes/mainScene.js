import { gameOptions } from "../gameConfig.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  init(data) {
    // If the game is in random mode
    this.randomMode = data.random === true

    // If no level number was passed set it to
    this.level =  (!isNaN(data.level)) ? data.level : 0
  }

  create() {
    
    this.gameWidth = this.cameras.main.width;
    this.gameHeight = this.cameras.main.height;

    this.makeRandom();
    this.createLevel();

    // Handle user input
    this.input.on('pointerdown', (pointer) => this.pickTile(pointer), this)
  }

  update() {}

  createLevel() {

    // The array of our tiles. We can modify this array as the game progresses
    // without modifying our initial settings
    this.tilesArray = [];

    // The container to contain all of our tiles
    this.tileGroup = this.add.container();

    // Centering the group on the screen. Use a container as it has positional members
    this.tileGroup.x = (this.gameWidth - gameOptions.tileSize * gameOptions.fieldSize.cols) * 0.5;
    this.tileGroup.y = (this.gameHeight - gameOptions.tileSize * gameOptions.fieldSize.rows) * 0.5;

    // Determine if the game is an random mode and what level to hand the user
    if(this.randomMode) {
        this.grid = gameOptions.randomLevels[this.level]
      } else {
        this.grid = gameOptions.randomLevels[this.level]
      // this.grid = gameOptions.levels[this.level]
    }

    // Nested loops to make a grid of gameOptions.filedSize.rows * gameOptions.fieldSize.cols
    for(let i = 0; i < gameOptions.fieldSize.rows; i++) {
      this.tilesArray[i] = [];
      for(let j = 0; j < gameOptions.fieldSize.cols; j++) {

        // Add the tile at i, j
        this.addTile(i, j);
      }
    }

    // Our restart button
    var restartButton = this.add.sprite(this.gameWidth * 0.5, this.gameHeight - this.tileGroup.y + gameOptions.tileSize * 0.5, 'restart')
      .setOrigin(0.5, 0)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('MainScene', {level: this.level,
          random: this.randomMode})
      })

    var randomButton = this.add.sprite(this.gameWidth * 0.5, this.gameHeight - this.tileGroup.y + gameOptions.tileSize * 2, 'restart')
      .setOrigin(0.5, 0)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('MainScene', {random: true, level : this.level})
      })

  }

  /**
   * Iterate over our levels array item, generate a tile, and place it in the tileGroup
   * @param {INT} row Row number to place the tile at
   * @param {INT} col Column number to place the tile at
   */
  addTile(row, col) {
    // Determine x and y position based on tilesize
    var tileXPos = col * gameOptions.tileSize + gameOptions.tileSize * 0.5;
    var tileYPos = row * gameOptions.tileSize + gameOptions.tileSize * 0.5;

    // Generate a tile image for the sprite
    var theTile = this.add.sprite(0, 0, 'tile')
    
    // Resize the tiles as needed
    theTile.width = gameOptions.tileSize;
    theTile.height = gameOptions.tileSize;
    
    // Assign the tile a value and color based on it's value
    // if (this.randomMode) {
    //   var tileValue = this.newLevel[row][col]
    // } else {
    //   var tileValue = this.levels[this.level][row][col];
    // }
    var tileValue = this.grid[row][col]
    
    // tint the tile
    theTile.tint = gameOptions.colors[tileValue]
    
    // Add the number to our tile
    var tileText = this.add.text(0, 0, tileValue.toString(), {
      font: (gameOptions.tileSize * 0.5).toString() + "px Arial",
      fontWeight: "bold"
    }).setOrigin(0.5);

    // Don't show the number if it's zero
    tileText.alpha = (tileValue > 0) ? 0.5 : 0;
    
    // The text and image go in a physics container which is what we place on the screen
    var tileContainer = this.add.container(tileXPos, tileYPos, [theTile, tileText])
      .setSize(gameOptions.tileSize, gameOptions.tileSize);

    // Add the tile to our tilesArray as an object so that can be manipulated
    this.tilesArray[row][col] = {
      tileSprite: theTile,
      value: tileValue,
      text: tileText
    }

    // Add the completed tile to tileGroupe
    this.tileGroup.add(tileContainer);
  }

  /** The function that handles user input */
  pickTile(e) {
    this.resetTileTweens();

    // Getting the X and Y positions within the group/container
    var posX = e.x - this.tileGroup.x;
    var posY = e.y - this.tileGroup.y;

    // Convert the coordinates into rows and columns
    var pickedRow = Math.floor(posY / gameOptions.tileSize);
    var pickedCol = Math.floor(posX / gameOptions.tileSize);

    // Check that the row and column are inside the actual game field
    if (this.isValidTile(pickedRow, pickedCol)) {
      
      // The tile we selected
      var pickedTile = this.tilesArray[pickedRow][pickedCol]

      // It's numeric value
      var pickedValue = pickedTile.value;

      // If it's a valid, non-zero, tile...
      if (pickedValue > 0) {

        // Save picked tile Coordinates
        this.saveTile = new Phaser.Geom.Point(pickedRow, pickedCol);

        // Used to store possible landing places for the tile
        this.possibleLanding = [];
        this.possibleLanding.length = 0;

        // Animate the tile with a tween
        this.setTileTweens(pickedTile.tileSprite);

        // Loop through all directions
        for (let i = 0; i < gameOptions.directions.length; i++) {

          // Determine the coordinates to test
          var newRow = pickedRow + pickedValue * gameOptions.directions[i].x
          var newCol = pickedCol + pickedValue * gameOptions.directions[i].y

          // Is it a legal, empty, tile?
          if (this.isValidTile(newRow, newCol) && this.tilesArray[newRow][newCol].value == 0) {

            // Tween the tile
            this.setTileTweens(this.tilesArray[newRow][newCol].tileSprite)

            // This is a valid landing spot
            this.possibleLanding.push(new Phaser.Geom.Point(newRow, newCol))
          }
        }
      }

      // This is a tile inside the filed but is maybe empty
      else {

        // Check if the picked tile is in the array of possible landings
        if (this.pointInArray(new Phaser.Geom.Point(pickedRow, pickedCol))) {

          let sourceTile = this.tilesArray[this.saveTile.x][this.saveTile.y]

          // This tile can't be picked anymore
          pickedTile.value = -1;

          // Show the tile text. When it was 0 alpha was 0
          pickedTile.text.alpha = 0.5;

          // Setting destination tile text as the souce tile value
          pickedTile.text.text = sourceTile.value.toString();

          // Empty the Source tile
          sourceTile.value = 0;

          // Change source tile color
          sourceTile.tileSprite.tint = gameOptions.colors[0];

          // Hiding tile text
          sourceTile.text.alpha = 0

          // Check if the field is solved
          this.checkSolution();
        }

        // Empty possibleLanding array
        this.possibleLanding = []
        this.possibleLanding.length = 0
      }
    }

  }

  isValidTile(row, col){
    return (row < gameOptions.fieldSize.rows && row >= 0 && col < gameOptions.fieldSize.cols && col >= 0 )
  }

  resetTileTweens() {
    // Set the tween back to 0, initial settings, and stop it. Tween manager will destroy it after it is stopped.
    this.tweens.getAllTweens().forEach((tween) => tween.seek(0).stop())

  }

  setTileTweens(tile) {
    this.tweens.add({
      targets: tile,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 200,
      repeat: -1,
      yoyo: true
    })
  }

  // Check if a point is in the possibleLanding array
  pointInArray(p) {
    for (let i = 0; i < this.possibleLanding.length; i++) {
      // Did we find the point at i-th element?
      if (this.possibleLanding[i].x == p.x && this.possibleLanding[i].y == p.y){
        return true;
      }
    }

    // We checked the whole array and didn't find our point in it
    return false;
  }

  // Check to see if the level is solved
  checkSolution() {
    
    // Loop over the whole game field
    for (var i = 0; i < gameOptions.fieldSize.rows; i++) {
      for (var j = 0; j < gameOptions.fieldSize.cols; j++) {

        // if there's still an unsolved tile on the field
        if (this.tilesArray[i][j].value > 0) {
          return false;
        }
      }
    }
    // We've checked every tile so we have a solution
    // Start the game state, passing the next level

    this.time.delayedCall(1000, this.scene.start('MainScene', {level: this.level + 1}), [], this)
  }

  /**
   * Generates a random playable level
   * @param {INT} maxAttempts Max attempts to solve before moving on. Larger value for harder possible levels
   */
  generateRandomLevel(maxAttempts) {

    // Prevent empty boards
    if (maxAttempts < 2){
      maxAttempts = 2
    }
    // console.log("FOUND SOLUTION")

    // This is where we will store our newly generated level
    var newLevel = []

    // Initilizing our array so we start with an empty level
    for (var i = 0; i < gameOptions.fieldSize.rows; i++) {
      newLevel[i] = [];
      for (var j = 0; j < gameOptions.fieldSize.cols; j++) {
        newLevel[i][j] = 0
      }
    }

    // Pick a random start position
    var startPosition = new Phaser.Geom.Point(Phaser.Math.RND.between(0, gameOptions.fieldSize.rows - 1),
    Phaser.Math.RND.between(0, gameOptions.fieldSize.cols - 1))

    // We'll store the solution here later
    var solution = '';

    // Loop over every tile in the game
    for (i = 0; i < gameOptions.fieldSize.rows * gameOptions.fieldSize.cols; i++) {

      // Track how many times we've attempted to place a tile
      var attempts = 0

      // We repeat this loop
      do {

        // Set the tile to a random value between 1 - 4
        var randomTileValue = Phaser.Math.RND.between(1, 4);

        // Choose a random direction
        var randomDirection = Phaser.Math.RND.between(0, gameOptions.directions.length - 1);

        // Given the start position and tile value we can determine the destination
        var randomDestination = new Phaser.Geom.Point(startPosition.x + randomTileValue * gameOptions.directions[randomDirection].x,
          startPosition.y + randomTileValue * gameOptions.directions[randomDirection].y)

        // We've made one more attempt
        attempts ++;

      // Break out when we've found a legal destination OR we've run out of attempts
      } while(!this.isLegalDestination(randomDestination, newLevel) && attempts < maxAttempts)

      // We're out of the do loop, did we find a legal destination before running out of attempts?
      if (attempts < maxAttempts) {

        // Update the solution String
        solution = "(" + startPosition.x + "," + startPosition.y + ") => (" + randomDestination.x + "," + randomDestination.y + ")\n" + solution;

        // Add this valid tile to our field
        newLevel[startPosition.x][startPosition.y] = randomTileValue;

        // Start position is the last placed tile
        startPosition = new Phaser.Geom.Point(randomDestination.x, randomDestination.y);
      }
    }

    // Show the solution in the chrome console
    // console.log(newLevel)
    // console.log(solution)
    return newLevel;
  }

  /**
   * Check if a destination is a legal tile; in filed and not occupied
   * @param {Phaser.Geom.Point} p Phaser point to check
   */
  isLegalDestination(p, newLevel) {

    // If it's outside of the game field it's illega
    if(p.x < 0 || p.y < 0 || p.x >= gameOptions.fieldSize.rows || p.y >= gameOptions.fieldSize.cols) {
      return false;
    }

    // Occupied tiles are illegal
    if ( newLevel[p.x][p.y] != 0 ) {
      return false;
    }

    // Passed both of the above tests
    return true
  }

  makeRandom() {
    // Make sure we only make random levels once per game
    // This also keeps the "Restart" button working
    if(typeof gameOptions.randomLevels[1] !== 'undefined') return
    
    // Make a bunch of random levels
    for (let i = 0; i < 10; i ++) {
      // Ramp up the difficulty
      gameOptions.randomLevels[i] = this.generateRandomLevel(i * 2 + 2)
    }
  }
}