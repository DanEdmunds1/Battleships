# Battleships

DESCRIPTION:
This is the first project I completed as part of the Software Engineering Immersive program with General Assembly, taking place between 03/11/23 and 10/11/23.  The project brief required that I use JS, CSS, and HTML to create a classic arcade-style game from a choice of 10 options, from which I chose to create ‘Battleship’. 

DEPLOYMENT LINK: https://danedmunds1.github.io/Battleships/

TIMEFRAME: This was an independent project, the timeframe for which was seven days.

TECHNOLOGIES USED: HTML, CSS, Javascript

PROJECT BRIEF:
Battleships is a two-player game where each player covertly lays out their armada of ships on a game board. Each player then takes turns attempting to hit their opponent's ships by torpedoing specific squares hoping to hit an opponent's ship.
The winner is the player that sinks all the opponent's ships.
Requirements:
* The game should be one player, with the computer placing its pieces randomly at the start of the game
* The computer should be able to make random attacks on the player's board
Suggested enhancements:
* Responsive design
* More intelligent attacks by the computer
Challenges:
The biggest challenge here is the computer's moves. Firstly the ships need to be randomly placed, but without touching or overlapping, which requires a considerable amount of logic and recursion. Secondly when the computer attacks the player's board, if it hits a ship, it should try to hit adjacent squares in all directions until it has established that the ship has been sunk.

PLANNING: 
I started by drawing up a simple wireframe sketch which included two grids (one for the player's ships and another for the computer's), a start button, and the scores. I would later add a mute and unmute button for the background music, and a header to make the game look better.

Pseudocode:
Placing Ships: The Player
* The player has a 10 x 10 grid generated in JS
* The cell a player hovers their mouse over will receive the class of ‘hovered’ as will the x number of cells above this one
* X being whichever ship is being placed (5, 4, 3, 3, 2)
* The player can use the R-key to rotate the ship, making it horizontal
* Pressing R should change the equation used to calculate the length of this ship
* Once the player clicks, the hovered cells gain the class of ‘battleship’ and turn green
* Will include border protection, it will not allow a click if the length of the ship exceeds a border of the grid
* Will also include collision detection, to ensure the same cell is not chosen more than once
* Once a ship has been placed, the length should become 4 cells, then 3, then 3 again, and finally 2
* Once 5 successful placements of the ships have been made, the game will start

Playing the Game: The Player
* The AI will choose its own ship placement abiding by the same parameters as the player
* Select a random cell
* If cell - width, cell - width * 2, cell - width * 3 → all available, then place
* If the above is not true, choose a new cell
* Players will be able to click any cell on the opponent’s board
* If the box did not possess the class of ‘battleship’, that cell is given the class of ‘miss’’
* Miss cells will be greyed out and no longer valid for clicking
* If the cell contained a battleship, the box should be given the class of ‘hit’
* Cells with the hit class should turn red and no longer be clickable
* Once all cells in a ship have been hit, a point is awarded
* I can log the cells adjacent each time I click, this array can be stored and accessed later, if all elements in the array 
  have the class of ‘hit’, then a point is awarded
* Once 5 five points have been earned, the game will be over and the player will win

Placing Ships: The Computer
* Start each ship placement with a random choice between vertical and horizontal alignment
* Then choose a random cell on the grid
* If the cell passes parameters pertaining to the length of the ship and the available cells, then place and move on
* Else choose another cell
* Once parameters are met and the ship is placed, move to the next until all are placed

Playing the Game: The Computer
* Tell the computer to start by choosing a random cell in the grid
* If it misses, choose the cell diagonally up and left of the missing cell
* If that cell does not exist or is occupied with a ‘hit’ class cell, choose a random cell again
* If it hits a cell with the of ‘battleship’, then it should choose a vertically adjacent cell
* Give options of cell - 1, cell + 1, cell - 10, cell + 10
* If they were correct, then apply the same logic, looking for a class-less adjacent cell
* Once a player’s battleship is destroyed a point will be added to the computer, at which point it will go back to random 
  searching
* If the computer reaches 5 points, then the game will be over, and the computer will win

BUILD PROCESS:
I started by using JS to create grid divs in a 10 x 10 format, numbering each div from 0 to 99. As this was to be the player’s grid, upon which they would be able to place their ships I added event listeners for ‘mouseover’ and ‘click’ for every cell. In order to incorporate elements of responsive design into my project, I decided to include some hover effects to the grid, which highlights the cells upon which the player would be placing their ship if they were to click. Once they click and place their ship, the highlighted cells will reduce in length, allowing players to place ships of varying lengths, just as they would be able to do in the real game.

function reduceLengthOfShip() {
  if (chosenShips.length === 0) {
  } else if (chosenShips.length === 1) {
    cellsAdjacent.pop()
  } else if (chosenShips.length === 2) {
    cellsAdjacent.splice(3, 2)
  } else if (chosenShips.length === 3) {
    cellsAdjacent.splice(3, 2)
  } else if (chosenShips.length === 4) {
    cellsAdjacent.splice(2, 3)
  }
}

The computer will place its ships when the start button is clicked, and then the player can select any cell on the computer's grid. Each hit they hit a ship it will turn red and the code will check if the entire ship has been sunk. 

This function is responsible for checking for sunk ships. It will run a loop over the array of arrays that contain each chosen ship of the computer. It will check whether every cell in the current ship’s array has been hit. If so it will give all cells in that array the class of ‘sunk’, and push the same values into an array to be stored in another array that tracks which ships have been sunk. It will also update the scores and check to see if either the player or the computer has won the game.

function checkForSunkShipsOfEnemy() {
  aiChosenShips.forEach((ship, index) => {
    const allCellsHit = ship.every(cell => aiHitCells.includes(parseInt(cell)))
    if (allCellsHit) {
      const aiSunkShip = []
      ship.forEach(cellNumber => {
        cells2[cellNumber].classList.add('sunk')
        aiSunkShip.push(cellNumber)
      })
      playerCurrentScore += 1
      playerScoreCounter.innerText = playerCurrentScore
      aiArrayOfSunkShips.push(aiSunkShip)
      aiChosenShips.splice(index, 1)
      checkWinner()
    }
  })
}

The computer will select cells on the player's grid at random until it hits a ship. At this point, it will stop guessing randomly and check the cells immediately to the left and right of the hit cell. If both of these are misses then it will guess vertically. Once it hits another cell immediately adjacent it will continue in that direction until it reaches the end of the ship. If the ship is not fully sunk it will double back to the other side.

if (cells[initialHit + 3].classList.contains('chosen')) {
              cells[initialHit + 3].classList.add('hit')
              cells[initialHit + 3].classList.remove('chosen')
              playerHitCells.push(parseInt(cells[initialHit + 3].id))
              hitSound.play()
              checkForSunkShipsOfPlayer()
            } else if (cells[initialHit + 3].classList.contains('hit')) {
              if ((initialHit + 4) > 99) {
                trackLeftOne()
              } else {
                if (cells[initialHit + 4].classList.contains('chosen')) {
                  cells[initialHit + 4].classList.add('hit')
                  cells[initialHit + 4].classList.remove('chosen')
                  playerHitCells.push(parseInt(cells[initialHit + 4].id))
                  hitSound.play()
                  checkForSunkShipsOfPlayer()
                } else if (cells[initialHit + 4].classList.contains('hit')) {
                  // Ignore it, this is another ship, too advanced
                } else if (cells[initialHit + 4].classList.contains('miss')) {
                  // Go minus
                  trackLeftOne()
                } else {
                  cells[initialHit + 4].classList.add('miss')
                }
              }
            } else if (cells[initialHit + 3].classList.contains('miss')) {
              // Go minus
              trackLeftTwo()
            } else {
              cells[initialHit + 3].classList.add('miss')
            }

CHALLENGES:
The most challenging part of this project was getting the logic right for how the computer chooses which cells to select after it hits a player’s ship. It was challenging because it required a lot of nested conditionals that became confusing. The first draft of this was not very effective and allowed the computer to give up if it hit the end of a ship without sinking it (which would occur if the initial hit was in the middle of the ship). Then I rewrote the entire logic to allow the computer to make smarter decisions and follow a ship to either end until it is sunk. After that, I included more conditionals that handled the scenarios in which the computer tried to access information on cells that did not exist/were out-of-bounds to the grid.

WINS:
A major win was overcoming the challenge of the computer logic for following a ship it has hit until it is fully sunk, it took the most time and a lot of notetaking, backtracking, and problem-solving.
Another win was styling as each time I ran into an issue I knew how to fix it, which was great to see as it meant I had retained knowledge of CSS from the first week of the program and it wasn't pushed out by Javascript information.

KEY LEARNINGS / TAKEAWAYS:
This project gave me a great opportunity to become more familiar with functions, global variables, and scope. As a result, I feel more comfortable using them and I was able to better fix issues surrounding them when things in my game did not work. I also feel more comfortable with using nested if statements as I spent an entire two days using them to get the computer logic working the way I wanted it to.

BUGS:
There is a very specific scenario in which the computer will stop placing its pieces but I know how to fix it. If the player places a ship in a horizontal alignment in the top left corner, and the computer hits it in any of the centre cells (which is to say not the first or last cell of the ship), then if the computer guesses to the left, hitting cell 0, it will look for cell -1, which of course does not exist. To fix this I could wrap the computer's logic in an if statement checking if the cell they are looking for exists first. I did this for the vertical alignment because it had a higher chance of going out-of-bounds, but not for the horizontal alignment.

FUTURE IMPROVEMENTS:
In the game’s current state, if the player has placed multiple vertical ships next to each other, the computer will land on a cell at some point and run across these ships horizontally. Once this horizontal line is complete, no ship will be sunk but the computer will give up trying to look for the rest of the cells above or below this line it has created. If a human player encountered this issue they would know that such a line without a sunk ship would mean that their opponent has placed all his ships in one block, but it has been a struggle to convey this to the computer’s logic. This is an area for future improvement
