//need to place functions into class

const WIDTH = 36;
const HEIGHT = 16;
let boardJS = []; //game board represented in javascript

//create HTML game grid and runs the function to create the JS board.
//value in each cell represents what is in it.
// Player, Enemy, Obstacle, and defense direction
function makeBoard(width, height) {
  let w = 0;
  let h = 0;
  let boardDOM = document.querySelector('.board');
  //loop to create height
  for (let i = 0; i < height; i++) {
    let boardRow = document.createElement('tr');
    //loop to create width
    for (let j = 0; j < width; j++) {
      let boardCol = document.createElement('td');
      boardCol.setAttribute('class', `${h}-${w}`);
      boardRow.append(boardCol);
      w++;
    }
    boardDOM.append(boardRow);
    h++;
    w = 0;
  }
  makeBoardJS();
}

//create JS board in an array
//boardJS[h][w]
function makeBoardJS() {
  for (let i = 0; i < HEIGHT; i++) {
    boardJS.push(new Array(WIDTH).fill(null));
  }
  return boardJS;
}

//run game
makeBoard(WIDTH, HEIGHT);
