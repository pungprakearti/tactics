/*
A tactics game based on my love of x-com
*/
//default 36 x 16 room
class Tactics {
  constructor(width = 10, height = 10) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.boardJS = [];
    this.CHAR_START_POS = `${height - 1}-${width - 1}`;
    this.cellsToBeEmpty;
    this.makeBoardJS();
    // this.makeBoard();
    console.log('created new board');
  }

  makeBoardJS() {
    /*
    create JS board in a nested array
    */

    //create empty board
    for (let i = 0; i < this.HEIGHT; i++) {
      this.boardJS.push(new Array(this.WIDTH).fill(null));
    }

    //fill 15% of the board with walls
    let wallsToMake = Math.floor(this.HEIGHT * this.WIDTH * 0.15);

    //This is the number of cells that needs to be empty when checked
    //  with the flood fill script to ensure that characters can go into
    //  every cell on the board and not be blocked by walls
    this.cellsToBeEmpty = this.HEIGHT * this.WIDTH - wallsToMake;

    //randomly place walls by setting cell to 'wall'
    let wallCount = 0;
    let randV;
    let randH;
    while (wallCount < wallsToMake) {
      randV = getRandomInt(0, this.HEIGHT);
      randH = getRandomInt(0, this.WIDTH);

      //prevent wall from being placed in the character's position
      while (
        randV === +this.CHAR_START_POS.split('-')[0] &&
        randH === +this.CHAR_START_POS.split('-')[1]
      ) {
        randV = getRandomInt(0, this.HEIGHT);
        randH = getRandomInt(0, this.WIDTH);
      }

      //If null then create wall in cell
      if (this.boardJS[randV][randH] === null) {
        this.boardJS[randV][randH] = 'wall';
        wallCount++;
      }
    }
    return this.boardJS;
  }

  makeBoard() {
    /*
    create HTML game grid
    */

    let h = 0;
    let v = 0;

    //remove any previous board elements
    $('tr').remove();
    $('td').remove();

    let boardDOM = document.querySelector('.board');

    //loop to create height
    for (let i = 0; i < this.HEIGHT; i++) {
      let boardRow = document.createElement('tr');

      //loop to create width
      for (let j = 0; j < this.WIDTH; j++) {
        let boardCol = document.createElement('td');
        boardCol.setAttribute('id', `${v}-${h}`);

        //check if wall in boardJS. If wall, make black
        if (this.boardJS[v][h] === 'wall') {
          boardCol.setAttribute('bgcolor', 'black');
        }

        boardRow.append(boardCol);
        h++;
      }
      boardDOM.append(boardRow);
      v++;
      h = 0;
    }
  }
}

let game = new Tactics();
let curPOS;

// determine path by going longest straight and then diagonal to end
function pathing() {
  let start = game.CHAR_START_POS.split('-');
  let end = mousePOS.split('-');
  curPOS = game.CHAR_START_POS.split('-');
  curPOS[0] = +curPOS[0];
  curPOS[1] = +curPOS[1];
  start[0] = +start[0];
  start[1] = +start[1];
  end[0] = +end[0];
  end[1] = +end[1];
  let vDist = 0;
  let hDist = 0;
  let direction = ['v', 'h'];

  //find direction to travel
  //vertical check
  if (start[0] >= end[0]) {
    vDist = start[0] - end[0];
    direction[0] = 'u';
  } else {
    vDist = end[0] - start[0];
    direction[0] = 'd';
  }

  //horizontal check
  if (start[1] >= end[1]) {
    hDist = start[1] - end[1];
    direction[1] = 'l';
  } else {
    hDist = end[1] - start[1];
    direction[1] = 'r';
  }
  // console.log(`direction = ${direction[0]}${direction[1]}`);

  //clear previous highlighted divs
  $('td').attr('bgcolor', 'white');

  //move straight
  //find longest stretch(vertically or horizontally)
  //move horizontal to diagonal
  if (vDist >= hDist) {
    //highlight vertical to diagonal
    // console.log('vertical is longer');
    if (direction[0] === 'u') {
      for (let i = start[0]; i >= start[0] + (hDist - vDist); i--) {
        curPOS[0] = i;
        $(`#${i}-${start[1]}`).attr('bgcolor', 'yellow');
      }
    } else {
      for (let i = start[0]; i <= start[0] + vDist - hDist; i++) {
        curPOS[0] = i;
        $(`#${i}-${start[1]}`).attr('bgcolor', 'yellow');
      }
    }
  } else {
    //highlight horizontal to diagonal
    // console.log('horizontal is longer');
    if (direction[1] === 'r') {
      for (let i = start[1]; i <= start[1] + (hDist - vDist); i++) {
        curPOS[1] = i;
        $(`#${start[0]}-${i}`).attr('bgcolor', 'yellow');
      }
    } else {
      for (let i = start[1]; i >= start[1] - (hDist - vDist); i--) {
        curPOS[1] = i;
        $(`#${start[0]}-${i}`).attr('bgcolor', 'yellow');
      }
    }
  }

  //Up and Left
  if (direction[0] === 'u' && direction[1] === 'l') {
    let k = 0;
    for (let v = curPOS[0]; v > end[0]; v--) {
      //up
      $(`#${v}-${curPOS[1] + k}`).attr('bgcolor', 'yellow');
      k--;
      //left
      $(`#${v}-${curPOS[1] + k}`).attr('bgcolor', 'yellow');
    }
  }

  //Up and Right
  if (direction[0] === 'u' && direction[1] === 'r') {
    let k = 0;
    for (let v = curPOS[0]; v > end[0]; v--) {
      //up
      $(`#${v}-${curPOS[1] + k}`).attr('bgcolor', 'yellow');
      k++;
      //right
      $(`#${v}-${curPOS[1] + k}`).attr('bgcolor', 'yellow');
    }
  }

  //Down and Left
  if (direction[0] === 'd' && direction[1] === 'l') {
    let k = 0;
    for (let v = curPOS[0]; v < end[0]; v++) {
      //up
      $(`#${v}-${curPOS[1] - k}`).attr('bgcolor', 'yellow');
      k++;
      //right
      $(`#${v}-${curPOS[1] - k}`).attr('bgcolor', 'yellow');
    }
  }

  //Down and Right
  if (direction[0] === 'd' && direction[1] === 'r') {
    let k = 0;
    for (let v = curPOS[0]; v < end[0]; v++) {
      //up
      $(`#${v}-${curPOS[1] + k}`).attr('bgcolor', 'yellow');
      k++;
      //right
      $(`#${v}-${curPOS[1] + k}`).attr('bgcolor', 'yellow');
    }
  }

  //set end as current position of character
  curPOS[0] = end[0];
  curPOS[1] = end[1];

  $(`#${start[0]}-${start[1]}`).attr('bgcolor', 'green');
  $(`#${end[0]}-${end[1]}`).attr('bgcolor', 'red');

  movPlayer();
}

let mousePOS;

//test with hover to highlight cell
function getMousePOS() {
  $('.board')
    .on('mouseenter', 'td', function(event) {
      $(event.target).attr('bgcolor', 'orange');
      mousePOS = $(event.target).attr('id');
      // console.log(mousePOS);
      pathing();
    })
    .on('mouseleave', 'td', function(event) {
      $(event.target).attr('bgcolor', 'white');
    });
}

function movPlayer() {
  $('.board').on('click', 'td', function(event) {
    game.CHAR_START_POS = $(event.target).attr('id');

    //clear previous highlighted divs
    $('td').attr('bgcolor', 'white');

    //place green color on new curPOS
    $(`#${curPOS[0]}-${curPOS[1]}`).attr('bgcolor', 'green');
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

let cellCount = 0;
let finishCount = 0;
function floodFill(posArr, cb) {
  let delay = 0; // delay to show floodfill in milliseconds

  //check for null cell
  if (game.boardJS[posArr[0]][posArr[1]] === null) {
    //set cell as empty and count it
    game.boardJS[posArr[0]][posArr[1]] = 'empty';
    cellCount++;
    $(`#${posArr[0]}-${posArr[1]}`).text(cellCount);
    $(`#${posArr[0]}-${posArr[1]}`).attr('bgcolor', 'lightblue');

    //create flood fill checks in 4 surrounding cells
    //up
    if (posArr[0] > 0 && game.boardJS[posArr[0] - 1][posArr[1]] === null) {
      setTimeout(function() {
        floodFill([posArr[0] - 1, posArr[1]], countFinishedFn);
      }, delay);
      //right
    }
    if (
      posArr[1] < game.WIDTH - 1 &&
      game.boardJS[posArr[0]][posArr[1] + 1] === null
    ) {
      setTimeout(function() {
        floodFill([posArr[0], posArr[1] + 1], countFinishedFn);
      }, delay);
      //down
    }
    if (
      posArr[0] < game.HEIGHT - 1 &&
      game.boardJS[posArr[0] + 1][posArr[1]] === null
    ) {
      setTimeout(function() {
        floodFill([posArr[0] + 1, posArr[1]], countFinishedFn);
      }, delay);
      //left
    }
    if (posArr[1] > 0 && game.boardJS[posArr[0]][posArr[1] - 1] === null) {
      setTimeout(function() {
        floodFill([posArr[0], posArr[1] - 1], countFinishedFn);
      }, delay);
    }

    return cb();
  } else {
    return;
  }
}

//CHECK THIS WITHOUT THE SETTIMEOUT <--------------------------------------
function countFinishedFn() {
  setTimeout(function() {
    finishCount++;
    // console.log('cellCount', cellCount, 'finishCount', finishCount);
    if (cellCount === finishCount) {
      // console.log(game);

      //if the cellCount doesn't match finishCount, that means there is
      //at least one blocked cell, so recreate the board
      if (cellCount !== game.cellsToBeEmpty) {
        game = new Tactics(); // probably don't have to remake the entire game class in order to make a new random map
        cellCount = 0;
        finishCount = 0;
        floodFill(
          [
            game.CHAR_START_POS.split('-')[0],
            game.CHAR_START_POS.split('-')[1]
          ],
          countFinishedFn
        );

        //Check is good, make the HTML board
      } else {
        game.makeBoard();
      }
    }
  }, 0);
}

getMousePOS();

floodFill(
  [game.CHAR_START_POS.split('-')[0], game.CHAR_START_POS.split('-')[1]],
  countFinishedFn
);

/*
Need to redraw board after every turn

don't draw until boardJS is good.


player movement

drawing board

board and coords



*/
