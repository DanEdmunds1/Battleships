
// ELEMENTS
// Remember you replaced innerText with id in various locations, if you run into issues, locate them
const grid = document.querySelector('.grid')
const grid2 = document.querySelector('.grid2')
const playerScoreCounter = document.getElementById('player-score')
const computerScoreCounter = document.getElementById('computer-score')
const body = document.querySelector('body')
const startButton = document.getElementById('start-game-button')
startButton.disabled = true
const width = 10
const cellCount = width * width
const cellCount2 = width * width
// GLOBAL VARIABLES

// Arrays
let cells = []
let cells2 = []
let cellsAdjacent = []
let aiCellsAdjacent = []
let chosenShips = []
let aiChosenShips = []
let playerHitCells = []
let aiHitCells = []
let playerArrayOfSunkShips = []
let aiArrayOfSunkShips = []
let aiIndexOfHoverCell = []

// Others
let playerCurrentScore = 0
let computerCurrentScore = 0
let globalIndexOfHoverCell
let playerShipsToBeRemoved = chosenShips
let aiRandomStartCell
let randomCellToPlace
let cellToHit = 99
let previousHit
let initialHit
let missedCell


// Game States
let rotate = false
let aiRotate = false
let turnOnEnemyGrid = false
let turnOnPlayerGrid = true
let gameOver = false
let computerHasHit = false

// To Chop?
// cells = document.querySelectorAll('.grid div')

// const alreadyChosen = cellsAdjacent.some(
//   index => cells[index].classList.contains('chosen'))


// Grid Creation
function createGrid() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div')
    cell.innerText = i
    cell.id = i
    cell.style.width = `${100 / width}%`
    grid.append(cell)
    cells.push(cell)
    cell.addEventListener('mouseover', function () {
      globalIndexOfHoverCell = parseInt(this.id)
      // console.log(cells[globalIndexOfHoverCell].classList.length === 0)
      if (rotate) {
        cellsAdjacent = [
          globalIndexOfHoverCell,
          globalIndexOfHoverCell + 1,
          globalIndexOfHoverCell + 2,
          globalIndexOfHoverCell + 3,
          globalIndexOfHoverCell + 4]
        reduceLengthOfShip()
      } else if (!rotate) {
        cellsAdjacent = [
          globalIndexOfHoverCell,
          globalIndexOfHoverCell - width,
          globalIndexOfHoverCell - 2 * width,
          globalIndexOfHoverCell - 3 * width,
          globalIndexOfHoverCell - 4 * width]
        reduceLengthOfShip()
      }
      hover()
      clearHoverOfEnemy()
    })
    cell.addEventListener('mouseout', function () {
      cells.forEach(cell => {
        cell.classList.remove('hovered')
      })
    })
    cell.addEventListener('click', placeShip)
  }
}
createGrid()



// Second Grid Creation
function createGrid2() {
  for (let i = 0; i < cellCount2; i++) {
    const cell2 = document.createElement('div')
    cell2.innerText = i
    cell2.id = i
    cell2.style.width = `${100 / width}%`
    grid2.append(cell2)
    cells2.push(cell2)
    cell2.addEventListener('mouseover', function () {
      aiIndexOfHoverCell = [parseInt(this.id)]
    })
    cell2.addEventListener('click', clickEnemyCell)
  }
}
createGrid2()



// Creates Hover Effect
function hover() {
  cells.forEach(cell => {
    cell.classList.remove('hovered')
  })
  cellsAdjacent.forEach(index => {
    if (chosenShips.length === 5) {
    } else {
      if (cells[index] && turnOnPlayerGrid) {
        cells[index].classList.add('hovered')
      }
    }
  })
}

function clearHoverOfEnemy() {
  cells2.forEach(cell => {
    cell.classList.remove('hovered')
  })
}


// Sets Bounds Detection for the Player and Pushes their ships into an Array
function placeShip() {
  cells.forEach(cell => {
    cell.classList.remove('hovered')
  });
  if (turnOnPlayerGrid) {
    const outOfBoundsVertical = cellsAdjacent.some(index => index < 0) && !rotate
    const outOfBoundsHorizontal = cellsAdjacent.some(index => {
      const hoveredRow = Math.floor(globalIndexOfHoverCell / width)
      const indexRow = Math.floor(index / width)
      // Calculate the rightmost and leftmost cells in the row
      const rightmostCellInRow = (hoveredRow + 1) * width - 1
      const leftmostCellInRow = hoveredRow * width
      // Check for out-of-bounds horizontally, considering the ship's length (5 cells)
      return (
        index < 0 ||
        index >= cellCount ||
        (indexRow !== hoveredRow && (index < leftmostCellInRow || index > rightmostCellInRow))
      ) && rotate
    })


    if (outOfBoundsVertical) {
      console.log('Out of Bounds Vertical')
    } else if (outOfBoundsHorizontal) {
      console.log('Out of Bounds Horizontal')
    } else {
      const alreadyChosen = cellsAdjacent.some(
        index => cells[index].classList.contains('chosen'))
      if (alreadyChosen) {
        console.log('Already chosen')
      } else {
        if (chosenShips.length === 4) {
          console.log('start button enabled')
          startButton.disabled = false
          startButton.style.cursor = "pointer"
        } if (chosenShips.length === 5) {
          console.log('All ships placed')
        } else {
          console.log('All Good')
          const currentShip = []
          cellsAdjacent.forEach(index => {
            cells[index].classList.add('chosen')
            currentShip.push(parseInt(cells[index].id))
          })
          chosenShips.push(currentShip)

          console.log('Player Chosen SHips', chosenShips[0],
            chosenShips[1],
            chosenShips[2],
            chosenShips[3],
            chosenShips[4])
        }
      }
    }
  }
}


// Allows Player to Rotate their Ship
function rotateCellsAdjacent(evt) {
  const key = evt.code
  if (key === 'KeyR') {
    rotate = !rotate
    console.log(rotate)

    cells[globalIndexOfHoverCell].dispatchEvent(new Event('mouseover'));
  }
}


// Lets the ships reduce in length, allowing you to place 5 in total
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




// COMPUTER BEHAVIOUR



// Overall Function for placing their ships
function aiPlaceShip() {
  getRandomDirection()
  randomCellToPlace = Math.floor(Math.random() * 100)
  aiRandomStartCell = randomCellToPlace
  aiCalculateAdjacentCells()
  aiBoundsDetection()
}

// Allows computer to place vertically or horizontally, it chooses a direction at random
function getRandomDirection() {
  let zeroOrOne = Math.floor(Math.random() * 2)
  if (zeroOrOne === 0) {
    aiRotate = false
  } else if (zeroOrOne === 1) {
    aiRotate = true
  }
}

// Calculates the location of the rest of the cells in the ship
function aiCalculateAdjacentCells() {
  if (aiRotate) {
    aiCellsAdjacent = [
      aiRandomStartCell,
      aiRandomStartCell + 1,
      aiRandomStartCell + 2,
      aiRandomStartCell + 3,
      aiRandomStartCell + 4]
    aiReduceLengthOfShip()
  } else if (!aiRotate) {
    aiCellsAdjacent = [
      aiRandomStartCell,
      aiRandomStartCell - width,
      aiRandomStartCell - 2 * width,
      aiRandomStartCell - 3 * width,
      aiRandomStartCell - 4 * width]
    aiReduceLengthOfShip()
  }
}
// Allows 5 ships of decreasing lengths to be placed
function aiReduceLengthOfShip() {
  if (aiChosenShips.length === 0) {
  } else if (aiChosenShips.length === 1) {
    aiCellsAdjacent.pop()
  } else if (aiChosenShips.length === 2) {
    aiCellsAdjacent.splice(3, 2)
  } else if (aiChosenShips.length === 3) {
    aiCellsAdjacent.splice(3, 2)
  } else if (aiChosenShips.length === 4) {
    aiCellsAdjacent.splice(2, 3)
  }
}


// Bounds Detection to prevent overlapping or spilling onto other rows
function aiBoundsDetection() {
  const aiOutOfBoundsVertical = aiCellsAdjacent.some(index => index < 0) && !aiRotate
  const aiOutOfBoundsHorizontal = aiCellsAdjacent.some(index => {
    const aiHoveredRow = Math.floor(aiRandomStartCell / width)
    const aiIndexRow = Math.floor(index / width)
    // Calculate the rightmost and leftmost cells in the row
    const aiRightmostCellInRow = (aiHoveredRow + 1) * width - 1
    const aiLeftmostCellInRow = aiHoveredRow * width
    // Check for out-of-bounds horizontally, considering the ship's length (5 cells)
    return (
      index < 0 ||
      index >= cellCount ||
      (aiIndexRow !== aiHoveredRow && (index < aiLeftmostCellInRow || index > aiRightmostCellInRow))
    ) && aiRotate
  })

  if (aiOutOfBoundsVertical || aiOutOfBoundsHorizontal) {
    aiPlaceShip()
  } else {
    const aiAlreadyChosen = aiCellsAdjacent.some(index => cells2[index].classList.contains('ai-chosen'))
    if (aiAlreadyChosen) {
      aiPlaceShip()
    } else {
      if (aiChosenShips.length === 5) {
      } else {
        const aiCurrentShip = []
        aiCellsAdjacent.forEach(index => {
          cells2[index].classList.add('ai-chosen')
          aiCurrentShip.push(parseInt(cells2[index].id))
        })
        aiChosenShips.push(aiCurrentShip)
        console.log('AI Chosen SHips', aiChosenShips[0],
          aiChosenShips[1],
          aiChosenShips[2],
          aiChosenShips[3],
          aiChosenShips[4])
        console.log(aiChosenShips)
      }
    }
  }
}

// Allows the player to fire against the computer
// The computer fires back when the player makes a valid shot
function clickEnemyCell() {
  if (turnOnEnemyGrid) {
    if (!gameOver) {
      console.log(aiIndexOfHoverCell)
      const successfulHit = aiIndexOfHoverCell.some(index => cells2[index].classList.contains('ai-chosen'))
      const alreadySuccessfulHit = aiIndexOfHoverCell.some(index => cells2[index].classList.contains('hit'))
      const alreadyAMiss = aiIndexOfHoverCell.some(index => cells2[index].classList.contains('miss'))
      if (successfulHit) {
        enemyShipHit()
        if (gameOver) {
          console.log('Game Over')
        } else {
          aiFires()
        }
      } else if (alreadyAMiss) {
        console.log('This cell is already a miss, choose another')
      } else if (alreadySuccessfulHit) {
        console.log('Cell already a hit, choose another')
      } else {
        console.log(`Index ${aiIndexOfHoverCell} is a miss`)
        aiIndexOfHoverCell.forEach(index => {
          cells2[index].classList.add('miss')
        })
        aiFires()
      }
    }
  }
}


// Pushes hit cells into an array to check for fully sunk ships + stlying
function enemyShipHit() {
  console.log('Enemy Ship Hit')
  aiIndexOfHoverCell.forEach(index => {
    cells2[index].classList.add('hit')
    cells2[index].classList.remove('ai-chosen')
    aiHitCells.push(parseInt(cells2[index].id))
    console.log(aiHitCells)
    checkForSunkShipsOfEnemy()
  })
}



// Checks to see if the values in the array match those of the cells the computer choose as ship placements
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



// Starts by choosing a random cell that hasn't already been chosen
function aiFires() {
  console.log('Enemy Has Fired')
  cellToHit = Math.floor(Math.random() * 100)
  const successfulHit = cells[cellToHit].classList.contains('chosen')
  const alreadySuccessfulHit = cells[cellToHit].classList.contains('hit')
  const alreadyAMiss = cells[cellToHit].classList.contains('miss')

  if (computerHasHit) {
    console.log('Choosing Adjacant')
    runHorizontal()
  } else {
    
    if (successfulHit) {
      cells[cellToHit].classList.add('hit')
      cells[cellToHit].classList.remove('chosen')
      playerHitCells.push(parseInt(cells[cellToHit].id))
      checkForSunkShipsOfPlayer()
      initialHit = cellToHit
      computerHasHit = true

    } else if (alreadySuccessfulHit) {
      aiFires()
    } else if (alreadyAMiss) {
      aiFires()
    } else {
      cells[cellToHit].classList.add('miss')
      if ((cellToHit - 11) >= 0) {
        cellToHit -= 11
      } else {
        cellToHit = cellToHit
      }
    }
  }
}



// Checks to see if the values stored in the hit cells array match those stored in the player's chosen ships array
function checkForSunkShipsOfPlayer() {
  playerShipsToBeRemoved.forEach((ship, index) => {
    const allCellsHit = ship.every(cell => playerHitCells.includes(parseInt(cell)))
    if (allCellsHit) {
      const playerSunkShip = []
      ship.forEach(cellNumber => {
        cells[cellNumber].classList.add('sunk')
        playerSunkShip.push(cellNumber)
        computerHasHit = false
      })
      computerCurrentScore += 1
      computerScoreCounter.innerText = computerCurrentScore
      playerArrayOfSunkShips.push(playerSunkShip)
      playerShipsToBeRemoved.splice(index, 1)
      checkWinner()
    }
  })
}



// Will search for cells to the right, and switch to left once it hits the end of a ship
function runHorizontal() {
  if ((initialHit + 1) > 99) {
    trackLeftFour()
  } else {
    // Existing Code
    if (cells[initialHit + 1].classList.contains('chosen')) {
      cells[initialHit + 1].classList.add('hit')
      cells[initialHit + 1].classList.remove('chosen')
      playerHitCells.push(parseInt(cells[initialHit + 1].id))
      checkForSunkShipsOfPlayer()
    } else if (cells[initialHit + 1].classList.contains('hit')) {
      if ((initialHit + 2) > 99) {
        trackLeftThree()
      } else {
        // Existing Code
        if (cells[initialHit + 2].classList.contains('chosen')) {
          cells[initialHit + 2].classList.add('hit')
          cells[initialHit + 2].classList.remove('chosen')
          playerHitCells.push(parseInt(cells[initialHit + 2].id))
          checkForSunkShipsOfPlayer()
        } else if (cells[initialHit + 2].classList.contains('hit')) {
          if ((initialHit + 3) > 99) {
            trackLeftTwo()
          } else {
            // Existing Code
            if (cells[initialHit + 3].classList.contains('chosen')) {
              cells[initialHit + 3].classList.add('hit')
              cells[initialHit + 3].classList.remove('chosen')
              playerHitCells.push(parseInt(cells[initialHit + 3].id))
              checkForSunkShipsOfPlayer()
            } else if (cells[initialHit + 3].classList.contains('hit')) {
              if ((initialHit + 4) > 99) {
                trackLeftOne()
              } else {
                // Existing Code
                if (cells[initialHit + 4].classList.contains('chosen')) {
                  cells[initialHit + 4].classList.add('hit')
                  cells[initialHit + 4].classList.remove('chosen')
                  playerHitCells.push(parseInt(cells[initialHit + 4].id))
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
          }
        } else if (cells[initialHit + 2].classList.contains('miss')) {
          // Go minus
          trackLeftThree()
        } else {
          cells[initialHit + 2].classList.add('miss')
        }
      }
    } else if (cells[initialHit + 1].classList.contains('miss')) {
      // Go minus
      trackLeftFour()
    } else {
      cells[initialHit + 1].classList.add('miss')
    }
  }
}

// Will search for cells below, and switch to above once it hits the end of a ship
function runVertical() {
  if ((initialHit + 10) > 99) {
    trackUpFour()
  } else {
    // Existing Code
    if (cells[initialHit + 10].classList.contains('chosen')) {
      cells[initialHit + 10].classList.add('hit')
      cells[initialHit + 10].classList.remove('chosen')
      playerHitCells.push(parseInt(cells[initialHit + 10].id))
      checkForSunkShipsOfPlayer()
    } else if (cells[initialHit + 10].classList.contains('hit')) {
      if ((initialHit + 20) > 99) {
        trackUpThree()
      } else {
        // Existing Code
        if (cells[initialHit + 20].classList.contains('chosen')) {
          cells[initialHit + 20].classList.add('hit')
          cells[initialHit + 20].classList.remove('chosen')
          playerHitCells.push(parseInt(cells[initialHit + 20].id))
          checkForSunkShipsOfPlayer()
        } else if (cells[initialHit + 20].classList.contains('hit')) {
          if ((initialHit + 30) > 99) {
            trackUpTwo()
          } else {
            // Existing Code
            if (cells[initialHit + 30].classList.contains('chosen')) {
              cells[initialHit + 30].classList.add('hit')
              cells[initialHit + 30].classList.remove('chosen')
              playerHitCells.push(parseInt(cells[initialHit + 30].id))
              checkForSunkShipsOfPlayer()
            } else if (cells[initialHit + 30].classList.contains('hit')) {
              if ((initialHit + 40) > 99) {
                trackUpOne()
              } else {
                // Existing Code
                if (cells[initialHit + 40].classList.contains('chosen')) {
                  cells[initialHit + 40].classList.add('hit')
                  cells[initialHit + 40].classList.remove('chosen')
                  playerHitCells.push(parseInt(cells[initialHit + 40].id))
                  checkForSunkShipsOfPlayer()
                } else if (cells[initialHit + 40].classList.contains('hit')) {
                  // Ignore it, this is another ship, too advanced
                } else if (cells[initialHit + 40].classList.contains('miss')) {
                  // Go minus
                  trackUpOne()
                } else {
                  cells[initialHit + 40].classList.add('miss')
                }
              }
            } else if (cells[initialHit + 30].classList.contains('miss')) {
              // Go minus
              trackUpTwo()
            } else {
              cells[initialHit + 30].classList.add('miss')
            }
          }
        } else if (cells[initialHit + 20].classList.contains('miss')) {
          // Go minus
          trackUpThree()
        } else {
          cells[initialHit + 20].classList.add('miss')
        }
      }
    } else if (cells[initialHit + 10].classList.contains('miss')) {
      // Go minus
      trackUpFour()
    } else {
      cells[initialHit + 10].classList.add('miss')
    }
  }
}


// Allows the runVertical function to look above for cells
function trackUpFour() {
  if (cells[initialHit - 10].classList.contains('chosen')) {
    cells[initialHit - 10].classList.add('hit')
    cells[initialHit - 10].classList.remove('chosen')
    playerHitCells.push(parseInt(cells[initialHit - 10].id))
    checkForSunkShipsOfPlayer()
  } else if (cells[initialHit - 10].classList.contains('hit')) {
    if (cells[initialHit - 20].classList.contains('chosen')) {
      cells[initialHit - 20].classList.add('hit')
      cells[initialHit - 20].classList.remove('chosen')
      playerHitCells.push(parseInt(cells[initialHit - 20].id))
      checkForSunkShipsOfPlayer()
    } else if (cells[initialHit - 20].classList.contains('hit')) {
      if (cells[initialHit - 30].classList.contains('chosen')) {
        cells[initialHit - 30].classList.add('hit')
        cells[initialHit - 30].classList.remove('chosen')
        playerHitCells.push(parseInt(cells[initialHit - 30].id))
        checkForSunkShipsOfPlayer()
      } else if (cells[initialHit - 30].classList.contains('hit')) {
        if (cells[initialHit - 40].classList.contains('chosen')) {
          cells[initialHit - 40].classList.add('hit')
          cells[initialHit - 40].classList.remove('chosen')
          playerHitCells.push(parseInt(cells[initialHit - 40].id))
          checkForSunkShipsOfPlayer()
        } else {
          computerHasHit = false
          aiFires()
        }
      }
      else {
        computerHasHit = false
        aiFires()
      }
    }
    else {
      computerHasHit = false
      aiFires()
    }
  } else {
    computerHasHit = false
    aiFires()
  }
}

function trackUpThree() {
  if (cells[initialHit - 10].classList.contains('chosen')) {
    cells[initialHit - 10].classList.add('hit')
    cells[initialHit - 10].classList.remove('chosen')
    playerHitCells.push(parseInt(cells[initialHit - 10].id))
    checkForSunkShipsOfPlayer()
  } else if (cells[initialHit - 10].classList.contains('hit')) {
    if (cells[initialHit - 20].classList.contains('chosen')) {
      cells[initialHit - 20].classList.add('hit')
      cells[initialHit - 20].classList.remove('chosen')
      playerHitCells.push(parseInt(cells[initialHit - 20].id))
      checkForSunkShipsOfPlayer()
    } else if (cells[initialHit - 20].classList.contains('hit')) {
      if (cells[initialHit - 30].classList.contains('chosen')) {
        cells[initialHit - 30].classList.add('hit')
        cells[initialHit - 30].classList.remove('chosen')
        playerHitCells.push(parseInt(cells[initialHit - 30].id))
        checkForSunkShipsOfPlayer()
      } else {
        computerHasHit = false
        aiFires()
      }
    }
    else {
      computerHasHit = false
      aiFires()
    }
  } else {
    computerHasHit = false
    aiFires()
  }
}

function trackUpTwo() {
  if (cells[initialHit - 10].classList.contains('chosen')) {
    cells[initialHit - 10].classList.add('hit')
    cells[initialHit - 10].classList.remove('chosen')
    playerHitCells.push(parseInt(cells[initialHit - 10].id))
    checkForSunkShipsOfPlayer()
  } else if (cells[initialHit - 10].classList.contains('hit')) {
    if (cells[initialHit - 20].classList.contains('chosen')) {
      cells[initialHit - 20].classList.add('hit')
      cells[initialHit - 20].classList.remove('chosen')
      playerHitCells.push(parseInt(cells[initialHit - 20].id))
      checkForSunkShipsOfPlayer()
    } else {
      computerHasHit = false
      aiFires()
    }
  } else {
    computerHasHit = false
    aiFires()
  }
}

function trackUpOne() {
  if (cells[initialHit - 10].classList.contains('chosen')) {
    cells[initialHit - 10].classList.add('hit')
    cells[initialHit - 10].classList.remove('chosen')
    playerHitCells.push(parseInt(cells[initialHit - 10].id))
    checkForSunkShipsOfPlayer()
  } else {
    computerHasHit = false
    aiFires()
  }
}


// Allows the runHorizontal function to look left for cells
function trackLeftOne() {
  if (cells[initialHit - 1].classList.contains('chosen')) {
    cells[initialHit - 1].classList.add('hit')
    cells[initialHit - 1].classList.remove('chosen')
    playerHitCells.push(parseInt(cells[initialHit - 1].id))
    checkForSunkShipsOfPlayer()
  } else {
    runVertical()
  }
}

function trackLeftTwo() {
  if (cells[initialHit - 1].classList.contains('chosen')) {
    cells[initialHit - 1].classList.add('hit')
    cells[initialHit - 1].classList.remove('chosen')
    playerHitCells.push(parseInt(cells[initialHit - 1].id))
    checkForSunkShipsOfPlayer()
  } else if (cells[initialHit - 1].classList.contains('hit')) {
    if (cells[initialHit - 2].classList.contains('chosen')) {
      cells[initialHit - 2].classList.add('hit')
      cells[initialHit - 2].classList.remove('chosen')
      playerHitCells.push(parseInt(cells[initialHit - 2].id))
      checkForSunkShipsOfPlayer()
    } else {
      runVertical()
      aiFires()
    }
  } else {
    runVertical()

  }
}

function trackLeftThree() {
  if (cells[initialHit - 1].classList.contains('chosen')) {
    cells[initialHit - 1].classList.add('hit')
    cells[initialHit - 1].classList.remove('chosen')
    playerHitCells.push(parseInt(cells[initialHit - 1].id))
    checkForSunkShipsOfPlayer()
  } else if (cells[initialHit - 1].classList.contains('hit')) {
    if (cells[initialHit - 2].classList.contains('chosen')) {
      cells[initialHit - 2].classList.add('hit')
      cells[initialHit - 2].classList.remove('chosen')
      playerHitCells.push(parseInt(cells[initialHit - 2].id))
      checkForSunkShipsOfPlayer()
    } else if (cells[initialHit - 2].classList.contains('hit')) {
      if (cells[initialHit - 3].classList.contains('chosen')) {
        cells[initialHit - 3].classList.add('hit')
        cells[initialHit - 3].classList.remove('chosen')
        playerHitCells.push(parseInt(cells[initialHit - 3].id))
        checkForSunkShipsOfPlayer()
      } else {
        runVertical()
      }
    }
    else {
      runVertical()
    }
  } else {
    runVertical()
  }
}

function trackLeftFour() {
  if (cells[initialHit - 1].classList.contains('chosen')) {
    cells[initialHit - 1].classList.add('hit')
    cells[initialHit - 1].classList.remove('chosen')
    playerHitCells.push(parseInt(cells[initialHit - 1].id))
    checkForSunkShipsOfPlayer()
  } else if (cells[initialHit - 1].classList.contains('hit')) {
    if (cells[initialHit - 2].classList.contains('chosen')) {
      cells[initialHit - 2].classList.add('hit')
      cells[initialHit - 2].classList.remove('chosen')
      playerHitCells.push(parseInt(cells[initialHit - 2].id))
      checkForSunkShipsOfPlayer()
    } else if (cells[initialHit - 2].classList.contains('hit')) {
      if (cells[initialHit - 3].classList.contains('chosen')) {
        cells[initialHit - 3].classList.add('hit')
        cells[initialHit - 3].classList.remove('chosen')
        playerHitCells.push(parseInt(cells[initialHit - 3].id))
        checkForSunkShipsOfPlayer()
      } else if (cells[initialHit - 3].classList.contains('hit')) {
        if (cells[initialHit - 4].classList.contains('chosen')) {
          cells[initialHit - 4].classList.add('hit')
          cells[initialHit - 4].classList.remove('chosen')
          playerHitCells.push(parseInt(cells[initialHit - 4].id))
          checkForSunkShipsOfPlayer()
        } else {
          runVertical()
        }
      }
      else {
        runVertical()
      }
    }
    else {
      runVertical()
    }
  } else {
    runVertical()
  }
}


// Checks if all ships have been sunk
function checkWinner() {
  if (playerCurrentScore === 5) {
    gameOver = true
    body.style.background = "url('../assets/Victory\ background.png')"
    body.style.backgroundPosition = "center"
    body.style.backgroundRepeat = "no-repeat"
    body.style.backgroundSize = "cover"

  } else if (computerCurrentScore === 5) {
    gameOver = true
    body.style.background = "url('../assets/defeat-background.png')"
    body.style.backgroundPosition = "center"
    body.style.backgroundRepeat = "no-repeat"
    body.style.backgroundSize = "cover"
    cells2.forEach(cell => {
      if (cell.classList.contains('ai-chosen')) {
        cell.classList.remove('ai-chosen')
        cell.classList.add('revealed')
      }
    })
  }
}


// EVENTS
document.addEventListener('keydown', rotateCellsAdjacent)

startButton.addEventListener('click', function () {
  aiPlaceShip()
  aiPlaceShip()
  aiPlaceShip()
  aiPlaceShip()
  aiPlaceShip()
  startButton.style.cursor = ""
  turnOnPlayerGrid = false
  turnOnEnemyGrid = true
  startButton.disabled = true
})


