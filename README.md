# Number Jumper
Converting from Phaser 2  
https://www.emanueleferonato.com/tag/znumbers/

-----

## Playing  
Select a numbered tile then move it to an empty space N spaces away where N is the number on the tile. Each tile can be moved _once_ and all must be moved to beat the game.  

## Technical Details  
### Level Generation  
Level generation is handled in the MainScene via `createLevel()` which will use the randomLevels array of gameOptions to populate a game grid in standard play or will use a gemerated array for other modes.  
Tile setup and placement is handled in `addTile()` when any 2D numberd array is passed.  
Random levels are generated with `generateRandomLevel()`. This function:  
1. Initilizes a 2D array of 0's  
2. Selects a random start position in the new array  
3. Selects a value, N, from 1 - 4 inclusive  
4. Selects a random direction from `gameOptions.directions`  
5. Checks the tile Nth tile in Direction.  
6. If the tile is not empty a new number and direction are tried, up to `maxAttempts` times which serves as a rough anology to difficulty.  
7. If the tile is empty it is assigned value N and used to restart the loop starting at item 3  
This process ends when the loop fails `maxAttempts` times to find a valid tile for any selected position.  
  
This process ensures that all generated game boards are winnable as generation is started from a winning condition.  


### Daily Levels  
Having daily levles that are consistant across platforms and change every day is acheived by running the above level generation process using a Random Number Generator with a single seed that is tied to the current date. This ensures that so long as the seed is unchanged the player will always recieve the same game board for any given value of `maxAttempts`, called `difficulty` in the calling function.  

The function `makeRandom()` creates a new Random Number Generator (Called a Random Data Generator in Phaser) using `new Date().toISOString().slice(0, 10)`. Using a standardized date format ensures that regardless of local date representation (YYYY-MM-DD vs MM-DD-YYYY vs DD-MM-YYYY etc.) all players will recieve the same seed and thus the same boards on any give date. The string is sliced to remove time data as this would result in different seeds and thus levels every time the seed was generated. It is worth noting that Phaser uses the current time as a seed for the default RDG.  

In future updates other `Date()` formats can be used to generate additional 'bonus' levels and/or a date-time string can be sliced to include the hour and allow for hourly levels to be generated.

### Score Keeping  
Score keeping is done using JavaScript's localStorage functions. The current date, which acts as the seed for the daily level generator, is stored as a key in the save JSON object along with two arrays for keeping score. If the date key does not match the current date the key is updated and the array responsible for keeping track of the daily level scores is reset as the user will be playing on new boards for that mode.  
Resetting of the Original/Standard levels is only done via a Score Reset option in the game options menu or by the user clearing localStorage, keeping these scores semi-persistant.  

Levels are scored only in completion time rounded down to the last second. Scores are saved in this second format, so a board taking 1:20 to clear has a score of 80. As a timed game Lower scores are better and this is the check performed by `checkScores()` in the `levelComplete` script. 

## TODO  
- Music/Sounds ??  

## Upgrades for later [v2]
- Unlock extra color themes as a reward  
- Bonus Levels, change seed based on game mode  
- Create variable sized game fields  
- Handle beating the game: Allow more than 10 levels per mode 
- Move HighScore checking to plugin or new class  
- Collect game mode options into collections  
