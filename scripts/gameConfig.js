// Import our scenes
import Boot from "./scenes/boot.js";
import PreloadScene from "./scenes/preloadScene.js";
import MainScene from "./scenes/mainScene.js";
import Menu from "./scenes/menu.js";
import levelComplete from "./scenes/levelComplete.js";
import optionsMenu from "./scenes/optionsMenu.js";

export const config = {
  // Phaser GameConfig object
  // https://photonstorm.github.io/phaser3-docs/global.html#GameConfig
  backgroundColor: "#353b48",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 750,
    height: 1334
  },
  scene: [Boot, Menu, PreloadScene, MainScene, levelComplete, optionsMenu],
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  // Hide the Phaser banner from the console
  banner: {
    hidePhaser: true,
    text: "#ccc",
    background: ["#00a8ff", "#9c88ff", "#fbc531", "#e84118", "#718093"]
  },
  // Banner display stuff
  title: "Number Jumper",
  url: "Any.key",
  version: "1.0.0a"
};

export const SOURCES = {
  /*
   * Images are all the file names without PNG.
   * Keys will be the file name. Only loads PNG files
   * IE -  this.add.image(100, 100, 'phaser-logo')
   * where the mainfest includes an entry for phaser-logo and there is
   * a phaser-logo.png file
   */
  IMAGE: [
    "audioOff",
    "audioOn",
    "backward",
    "barsHorizontal",
    "cross",
    "exitLeft",
    "forward",
    "gear",
    "home",
    "information",
    "leaderboardsComplex",
    "locked",
    "musicOff",
    "musicOn",
    "return",
    "tile",
    "trophy",
    "unlocked"
  ],

  AUDIO: {},
  SPRITE: {}
};

export const gameOptions = {
  // For saving/loading highscores
  localStorageName : 'NumberJumper',

  // Tile size in pixels
  tileSize: 100,

  // Our game grid
  fieldSize: {
    rows: 6,
    cols: 6
  },

  // Tile Colors
  /**
   * Expand this into an object so different pallets can be selected
   */
  colors: [0x718093, 0x00a8ff, 0x9c88ff, 0xfbc531, 0xe84118], // Original
  // colors: [0x718093, 0x88e0ce, 0x63C0AE, 0x3DA18F, 0x18816F],  // Mint
  // colors: [0x718093, 0xf9b1b1, 0xE58787, 0xD15C5C, 0xBD3232],  // Salmon
  // colors: [0x718093, 0x749cf2, 0x5B6BD8, 0x413ABF, 0x2809A5], // Blurple

  // The directions to check for openings in. Use only the first four to make things harder
  directions: [
    new Phaser.Geom.Point(0, 1),
    new Phaser.Geom.Point(0, -1),
    new Phaser.Geom.Point(1, 0),
    new Phaser.Geom.Point(-1, 0),
    new Phaser.Geom.Point(1, 1),
    new Phaser.Geom.Point(-1, -1),
    new Phaser.Geom.Point(1, -1),
    new Phaser.Geom.Point(-1, 1)
  ],

  // Our prebuilt levels
  levels: [
    [
      // level 1
      [0, 0, 0, 0, 0, 0],
      [3, 2, 3, 2, 2, 2],
      [0, 0, 2, 3, 2, 2],
      [2, 0, 2, 2, 0, 0],
      [0, 2, 3, 0, 2, 2],
      [2, 3, 0, 2, 0, 4]
    ],
    [
      // level 2
      [0, 2, 3, 3, 2, 1],
      [2, 0, 3, 3, 0, 2],
      [1, 4, 3, 3, 0, 1],
      [1, 4, 3, 3, 0, 1],
      [2, 0, 3, 3, 0, 2],
      [0, 2, 3, 3, 2, 1]
    ],
    [
      // level 3
      [0, 2, 2, 2, 0, 2],
      [1, 1, 1, 1, 1, 1],
      [1, 3, 0, 3, 3, 1],
      [1, 3, 3, 3, 3, 1],
      [1, 1, 1, 1, 1, 1],
      [4, 4, 0, 4, 0, 1]
    ],
    [
      // level 4
      [3, 4, 2, 2, 0, 2],
      [1, 1, 1, 1, 1, 1],
      [0, 1, 3, 0, 3, 1],
      [1, 3, 1, 3, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [3, 0, 0, 4, 0, 1]
    ],
    [
      // level 5
      [4, 2, 1, 2, 1, 4],
      [1, 2, 1, 1, 2, 1],
      [1, 3, 2, 3, 3, 1],
      [1, 1, 2, 2, 3, 1],
      [1, 0, 1, 1, 2, 1],
      [4, 0, 0, 4, 1, 4]
    ],
    [
      // level 6
      [3, 2, 1, 1, 2, 1],
      [1, 2, 1, 0, 2, 2],
      [2, 1, 1, 1, 2, 1],
      [1, 2, 1, 1, 2, 1],
      [0, 2, 1, 1, 2, 4],
      [3, 0, 0, 4, 0, 4]
    ],
    [
      // level 7
      [2, 0, 2, 3, 0, 2],
      [0, 2, 1, 3, 2, 1],
      [2, 0, 1, 3, 0, 2],
      [0, 2, 3, 3, 2, 1],
      [2, 0, 1, 3, 0, 2],
      [0, 2, 0, 3, 2, 1]
    ],
    [
      // level 8
      [1, 3, 0, 1, 1, 2],
      [0, 4, 0, 0, 2, 3],
      [3, 1, 0, 0, 3, 1],
      [1, 2, 0, 0, 1, 2],
      [4, 3, 1, 0, 4, 3],
      [2, 4, 1, 1, 2, 4]
    ],
    [
      // level 9
      [4, 1, 0, 0, 2, 4],
      [2, 4, 2, 4, 1, 0],
      [0, 0, 2, 0, 4, 2],
      [1, 1, 0, 0, 4, 2],
      [2, 4, 1, 4, 0, 1],
      [3, 0, 4, 1, 0, 4]
    ],
    [
      // level 10
      [3, 2, 2, 0, 2, 0],
      [2, 3, 2, 3, 2, 0],
      [0, 1, 3, 1, 2, 2],
      [1, 1, 0, 0, 0, 1],
      [2, 2, 1, 3, 3, 1],
      [3, 2, 1, 1, 2, 2]
    ]
  ],

  randomLevels: [
    // This array intentionally left blank
  ]
};
