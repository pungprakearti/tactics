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

  //create starting characters
  makeChars() {
    //set bottom row starting from left as spawn points for characters
    this.DPSpos = [this.boardJS.length - 1, 0];
    this.TANKpos = [this.boardJS.length - 1, 1];
    this.HEALpos = [this.boardJS.length - 1, 2];
    this.boardJS[this.boardJS.length - 1][0] = 'DPS';
    this.boardJS[this.boardJS.length - 1][1] = 'TANK';
    this.boardJS[this.boardJS.length - 1][2] = 'HEAL';
  }

  placeCharsHTML() {
    let chars = ['DPS', 'TANK', 'HEAL'];
    let charsPOS = ['DPSpos', 'TANKpos', 'HEALpos'];
    let char = ''
    for (let i = 0; i < chars.length; i++) {
      $(`.${chars[i]}`).remove();
      //char = WORK ON THIS HERE. 
      $(`#${this.(charsPOS[i])[0]}-${this.(charsPOS[i])[1]}`).append(
        $('<div>').attr('class', 'DPS')
      );
    }
  }
}

new Tactics();
