/*
A tactics game based on my love of x-com
*/
class Tactics {
  constructor(width = 36, height = 16, boardJS, DPSpos, TANKpos, HEALpos) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.boardJS = [];
    this.DPSpos = [];
    this.TANKpos = [];
    this.HEALpos = [];
    this.makeBoard();
    this.makeBoardJS();
    this.makeChars();
    this.placeCharsHTML();
    this.test();
    this.pathing();
  }

  //create HTML game grid and runs the function to create the JS board.
  //value in each cell represents what is in it.
  // Player, Enemy, Obstacle, and defense direction
  makeBoard() {
    let w = 0;
    let h = 0;
    let boardDOM = document.querySelector('.board');
    //loop to create height
    for (let i = 0; i < this.HEIGHT; i++) {
      let boardRow = document.createElement('tr');
      //loop to create width
      for (let j = 0; j < this.WIDTH; j++) {
        let boardCol = document.createElement('td');
        boardCol.setAttribute('id', `${h}-${w}`);
        boardRow.append(boardCol);
        w++;
      }
      boardDOM.append(boardRow);
      h++;
      w = 0;
    }
  }

  //create JS board in an array
  //boardJS[h][w]
  makeBoardJS() {
    for (let i = 0; i < this.HEIGHT; i++) {
      this.boardJS.push(new Array(this.WIDTH).fill(null));
    }
    return this.boardJS;
  }

  //create starting characters JS
  makeChars() {
    //set bottom row starting from left as spawn points for characters
    this.DPSpos = [this.boardJS.length - 1, 0];
    this.TANKpos = [this.boardJS.length - 1, 1];
    this.HEALpos = [this.boardJS.length - 1, 2];
    this.boardJS[this.boardJS.length - 1][0] = 'DPS';
    this.boardJS[this.boardJS.length - 1][1] = 'TANK';
    this.boardJS[this.boardJS.length - 1][2] = 'HEAL';
  }

  //creates characters on HTML board using coordinates from DPSpos,
  //  TANKpos, and HEALpos.
  placeCharsHTML() {
    let charNames = ['DPS', 'TANK', 'HEAL'];
    let charsPOS = [this.DPSpos, this.TANKpos, this.HEALpos];
    let posOnBoard;
    for (let i = 0; i < charNames.length; i++) {
      //remove current char
      $(`.${charNames[i]}`).remove();

      //append char to correct position on the board
      posOnBoard = `#${charsPOS[i][0]}-${charsPOS[i][1]}`;
      $(posOnBoard).append($('<div>').attr('class', charNames[i]));
    }
  }

  //on click
  //path to farthest possible cell per character
  //longest distance go straight until can diagonal, then diagonal
  pathing() {
    // console.log(this.DPSpos, this.test().mousePOS);
  }

  //test with hover to highlight cell
  test() {
    let mousePOS;
    $('.board')
      .on('mouseenter', 'td', function(event) {
        $(event.target).attr('bgcolor', 'orange');
        mousePOS = $(event.target).attr('id');
      })
      .on('mouseleave', 'td', function(event) {
        $(event.target).attr('bgcolor', 'white');
      });
  }
}

new Tactics();

function pathing() {
  let testCharPOS = '0-0';
  let testCharEndPOS = '8-20';
  let start = testCharPOS.split('-');
  let end = testCharEndPOS.split('-');
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
  console.log(`direction = ${direction[0]}${direction[1]}`);

  //find longest stretch(vertically or horizontally)
  if (vDist >= hDist) {
    //highlight vertical to diagonal
    console.log('vertical is longer');
  } else {
    //highlight horizontal to diagonal
    console.log('horizontal is longer');
    for (let i = start[1]; i <= start[1] + (hDist - vDist); i++) {
      $(`#${start[0]}-${i}`).attr('bgcolor', 'yellow');
    }
    //diagonal to end - Right and Down
    let k = 0;
    for (let j = start[1] + (hDist - vDist); j < end[1]; j++) {
      //console.log(`#${+start[0] + k}-${+j + 1}`); //right
      $(`#${+start[0] + k}-${+j + 1}`).attr('bgcolor', 'yellow');
      k++;
      //console.log(`#${+start[0] + k}-${+j + 1}`); //down
      $(`#${+start[0] + k}-${+j + 1}`).attr('bgcolor', 'yellow');
    }
  }

  $(`#${start[0]}-${start[1]}`).attr('bgcolor', 'green');
  $(`#${end[0]}-${end[1]}`).attr('bgcolor', 'red');
}

pathing();
