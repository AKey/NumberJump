# Number Jumper
Converting from Phaser 2  
https://www.emanueleferonato.com/tag/znumbers/

-----
## TODO  
+ Add a Menu state
  + ~~Play prebuilt games~~
    - [DONE] Loads levels from GameConfig
  + ~~Daily Games~~
    - [DONE] Passes random: true into the main game state
  + Bonus Levels
    - Set RNG seed to second value then launches like a daily game
  


+ Rebuild RNG System
  + Leave Phaser.Math.RND alone
    - Instanciate a new Random Data Generator, generating a Key for play mode and daily  



+ Game HUD
  - Include Level, Attempts, Running Time

+ ~~Handle beating the game: Finishing the last level~~
  - Hacked by hard coding 10 as the max levels. Will need to change later for larger sets of levels
- Home key in game scene  
- Unlock extra color themes as a reward  

+ Congratulations/Win screen  
  - Display level, attempts, time
  - Replay button, Next/Last level options, Home button