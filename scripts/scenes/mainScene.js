import { gameOptions } from "../gameConfig.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  init(data) {
    // Assign our game mode
    this.mode = data.mode || "standard"

    // If no level number was passed set it to
    this.level =  (!isNaN(data.level)) ? data.level : 0

    // Handle running over the level count
    // TODO: Handle a dynamic level count
    if (this.level >= 10 || this.level < 0) {
      this.level = 0
    }
  }

  create() {
    
    this.gameWidth = this.cameras.main.width;
    this.gameHeight = this.cameras.main.height;

    if(this.mode == 'daily') {
      this.makeRandom();
    }

    this.createLevel();
    this.makeHUD();

    this.timer = this.time.addEvent({delay: 6000000})

    // Handle user input
    this.input.on('pointerdown', (pointer) => this.pickTile(pointer), this)
  }

  update() {
    this.seconds = Math.floor(this.timer.getElapsedSeconds())
    this.timeText.text = 'TIME: ' + this.seconds
  }

  createLevel() {

    // The array of our tiles. We can modify this array as the game progresses
    // without modifying our initial settings, allowing for board restarts
    this.tilesArray = [];

    // The container to contain all of our tiles
    this.tileGroup = this.add.container();

    // Placing the game field on the screen. Use a container as it has positional members
    this.tileGroup.x = (this.gameWidth - gameOptions.tileSize * gameOptions.fieldSize.cols) * 0.5;
    this.tileGroup.y = (this.gameHeight - gameOptions.tileSize * gameOptions.fieldSize.rows) * 0.3;

    // Determine if the game is an random mode and what level to hand the user
    if(this.mode !== 'standard') {
        this.grid = gameOptions.randomLevels[this.level]
      } else {
        this.grid = gameOptions.levels[this.level]
    }

    // Nested loops to make a grid of gameOptions.filedSize.rows * gameOptions.fieldSize.cols
    for(let i = 0; i < gameOptions.fieldSize.rows; i++) {
      this.tilesArray[i] = [];
      for(let j = 0; j < gameOptions.fieldSize.cols; j++) {

        // Add the tile at i, j
        this.addTile(i, j);
      }
    }

    // Empty possibleLanding array. This is here to avoid an error caused by
    // an empty tile being the first one a player picks
    this.possibleLanding = []
    this.possibleLanding.length = 0
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

      // This is a tile inside the field but is maybe empty
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
    this.timer.paused = true
    this.time.delayedCall(500, this.nextLevel, [], this)
  }

  /**
   * Generates a random playable level
   * @param {INT} maxAttempts Max attempts to solve before moving on. Larger value for harder possible levels
   */
  generateRandomLevel(maxAttempts, RDG) {

    // Prevent empty boards
    if (maxAttempts < 2){
      maxAttempts = 2
    }

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
    var startPosition = new Phaser.Geom.Point(RDG.between(0, gameOptions.fieldSize.rows - 1),
    RDG.between(0, gameOptions.fieldSize.cols - 1))

    // We'll store the solution here later
    var solution = '';

    // Loop over every tile in the game
    for (i = 0; i < gameOptions.fieldSize.rows * gameOptions.fieldSize.cols; i++) {

      // Track how many times we've attempted to place a tile
      var attempts = 0

      // We repeat this loop
      do {

        // Set the tile to a random value between 1 - 4
        var randomTileValue = RDG.between(1, 4);

        // Choose a random direction
        var randomDirection = RDG.between(0, gameOptions.directions.length - 1);

        // Given the start position and tile value we can determine the destination
        var randomDestination = new Phaser.Geom.Point(startPosition.x + randomTileValue * gameOptions.directions[randomDirection].x,
          startPosition.y + randomTileValue * gameOptions.directions[randomDirection].y)

        // We've made one more attempt
        attempts ++;

      // Break out when we've found a legal destination OR we've run out of attempts
      } while ( !this.isLegalDestination(randomDestination, newLevel) && attempts < maxAttempts )

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

    // Initilize the seed based on game mode.
    // TODO: This is shortcutted to a value for now. CHANGE THIS 
    let seed = new Date().toISOString().slice(0, 10)
    var RDG = new Phaser.Math.RandomDataGenerator([seed])
    
    // Make a bunch of random levels
    for (let i = 0; i < 10; i ++) {
      // Ramp up the difficulty
      let difficulty = i + 2
      gameOptions.randomLevels[i] = this.generateRandomLevel(difficulty, RDG)
    }
  }

  nextLevel() {
    // this.scene.run('levelComplete', {level: this.level, time: this.seconds, mode: this.mode})
    this.scene.start('levelComplete', {level: this.level, time: this.seconds, mode: this.mode})
  }

  makeHUD() {
    //// UI stuff

    // Our restart button
    this.add.sprite(this.gameWidth * 0.5, 
      this.tileGroup.y + gameOptions.tileSize * gameOptions.fieldSize.rows + gameOptions.tileSize* 0.3, 
      'return')
      .setOrigin(0.5, 0)
      .setScale(2)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.restart({level: this.level,
          mode: this.mode})
      })

    // Previous Puzzle Button
    this.add.sprite(this.gameWidth * 0.5 - gameOptions.tileSize * 2, 
      this.tileGroup.y + gameOptions.tileSize * gameOptions.fieldSize.rows + gameOptions.tileSize* 0.3, 
      'backward')
      .setOrigin(0.5, 0)
      .setScale(2)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.restart({level: this.level - 1,
          mode: this.mode})
      })

    // Next Puzzle
    this.add.sprite(this.gameWidth * 0.5 + gameOptions.tileSize * 2, 
      this.tileGroup.y + gameOptions.tileSize * gameOptions.fieldSize.rows + gameOptions.tileSize* 0.3, 
      'forward')
      .setOrigin(0.5, 0)
      .setScale(2)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.restart({level: this.level + 1,
          mode: this.mode})
      })

    // Our Home button
    this.add.sprite(this.gameWidth * 0.5, 
      this.tileGroup.y + gameOptions.tileSize * gameOptions.fieldSize.rows + gameOptions.tileSize * 2, 
      'home')
      .setOrigin(0.5, 0)
      .setScale(2)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Menu');
      })

    this.timeText = this.add.bitmapText(this.tileGroup.x, this.tileGroup.y - gameOptions.tileSize * 1.5, 'chunq', `TIME: `)
    .setLetterSpacing(1)
    
    // Level indicator
    this.add.bitmapText(this.tileGroup.x, this.tileGroup.y - gameOptions.tileSize, 'chunq', `LEVEL: ${this.level + 1}`)
    .setLetterSpacing(1)

  }

}