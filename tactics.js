/*
A tactics game based on my love of x-com
*/

//default 36 x 16 room
class Map {
  /*
  This class contains the map creation and checking
  */

  constructor(width = 10, height = 10) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.mapJS;
    // this.CHAR_START_POS = `${height - 1}-${width - 1}`;
    this.cellsToBeEmpty;

    this.cellCount = 0;
    this.finishCount = 0;

    // this.makeMapJS();
    // console.log('Making a map in JS');
  }

  makeMapJS(playerPosArr) {
    /*
    create JS map in a nested array
    */

    //emtpy array
    this.mapJS = [];

    /*
    create empty Map

    5x5 - mapJS[y][x]
    [[null,null,null,null,null],
    [null,null,null,null,null],
    [null,null,null,null,null],
    [null,null,null,null,null],
    [null,null,null,null,null]]
    */
    for (let i = 0; i < this.HEIGHT; i++) {
      this.mapJS.push(new Array(this.WIDTH).fill(null));
    }

    //fill 15% of the Map with walls
    let wallsToMake = Math.floor(this.HEIGHT * this.WIDTH * 0.15);

    //This is the number of cells that needs to be empty when checked
    //  with the flood fill script to ensure that characters can go into
    //  every cell on the Map and not be blocked by walls
    this.cellsToBeEmpty = this.HEIGHT * this.WIDTH - wallsToMake;

    //randomly place walls by setting cell to 'wall'
    let wallCount = 0;
    let randV;
    let randH;
    while (wallCount < wallsToMake) {
      randV = getRandomInt(0, this.HEIGHT);
      randH = getRandomInt(0, this.WIDTH);

      //prevent wall from being placed in the character's position
      //will eventually make this into a room <-------------------------
      //in the future accept and array of character positions
      for (let charPos in playerPosArr) {
        //
        while (
          // randV === +this.CHAR_START_POS.split('-')[0] &&
          // randH === +this.CHAR_START_POS.split('-')[1]
          randV === charPos[1] &&
          randH === charPos[0]
        ) {
          randV = getRandomInt(0, this.HEIGHT);
          randH = getRandomInt(0, this.WIDTH);
        }
      }

      //If null then create wall in cell
      if (this.mapJS[randV][randH] === null) {
        this.mapJS[randV][randH] = 'wall';
        wallCount++;
      }
    }
    console.log('Created map in JS');
    return this.mapJS;
  }

  makeMap() {
    /*
    create HTML game grid
    */
    let h = 0;
    let v = 0;

    //remove any previous map elements
    $('tr').remove();
    $('td').remove();

    let $map = $('.map');

    //loop to create height
    for (let i = 0; i < this.HEIGHT; i++) {
      let $row = $('<tr>');

      //loop to create width
      for (let j = 0; j < this.WIDTH; j++) {
        let $col = $('<td>');

        //check if wall in mapJS. If wall, make black
        if (this.mapJS[v][h] === 'wall') {
          $col.attr({
            id: `${v}-${h}`,
            bgcolor: 'black'
          });
          //else make white
        } else {
          $col.attr({
            id: `${v}-${h}`,
            bgcolor: 'white'
          });
        }
        $row.append($col);
        h++;
      }
      $map.append($row);
      v++;
      h = 0;
    }
    console.log('Created  map in HTML');
  }
}

class Player {
  constructor(x, y) {
    this.curPOS = [x, y];
  }
}

// determine path by going longest straight and then diagonal to end
function pathing() {
  let start = map.CHAR_START_POS.split('-');
  let end = mousePOS.split('-');
  curPOS = map.CHAR_START_POS.split('-');
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
  $('.map')
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
  $('.map').on('click', 'td', function(event) {
    map.CHAR_START_POS = $(event.target).attr('id');

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

function floodFill(map, posArr, cb) {
  let delay = 0; // delay to show floodfill in milliseconds

  //check for null cell
  if (map.mapJS[posArr[0]][posArr[1]] === null) {
    //set cell as empty and count it
    map.mapJS[posArr[0]][posArr[1]] = 'empty';
    map.cellCount++;
    $(`#${posArr[0]}-${posArr[1]}`).text(map.cellCount);
    $(`#${posArr[0]}-${posArr[1]}`).attr('bgcolor', 'lightblue');

    //create flood fill checks in 4 surrounding cells
    //up
    if (posArr[0] > 0 && map.mapJS[posArr[0] - 1][posArr[1]] === null) {
      setTimeout(function() {
        floodFill(map, [posArr[0] - 1, posArr[1]], countFinished);
      }, delay);
      //right
    }
    if (
      posArr[1] < map.WIDTH - 1 &&
      map.mapJS[posArr[0]][posArr[1] + 1] === null
    ) {
      setTimeout(function() {
        floodFill(map, [posArr[0], posArr[1] + 1], countFinished);
      }, delay);
      //down
    }
    if (
      posArr[0] < map.HEIGHT - 1 &&
      map.mapJS[posArr[0] + 1][posArr[1]] === null
    ) {
      setTimeout(function() {
        floodFill(map, [posArr[0] + 1, posArr[1]], countFinished);
      }, delay);
      //left
    }
    if (posArr[1] > 0 && map.mapJS[posArr[0]][posArr[1] - 1] === null) {
      setTimeout(function() {
        floodFill(map, [posArr[0], posArr[1] - 1], countFinished);
      }, delay);
    }

    return cb();
  } else {
    return;
  }
}

function countFinished(map) {
  setTimeout(function() {
    map.finishCount++;

    if (map.cellCount === map.finishCount) {
      //if the cellCount doesn't match finishCount, that means there is
      //at least one blocked cell, so recreate the map
      if (map.cellCount !== map.cellsToBeEmpty) {
        map.makeMapJS([player1]);
        map.cellCount = 0;
        map.finishCount = 0;
        floodFill(map, player1.curPOS, countFinished);
        //Check is good, make the HTML map
      } else {
        map.makeMap();
      }
    }
  }, 0);
}

/*
START GAME HERE 
 */
getMousePOS();

//create map instance
let map = new Map();

//create player instances
let player1 = new Player(0, map.HEIGHT - 1);

map.makeMapJS([player1.curPOS]);

console.log('map.finishCount', map.finishCount);

floodFill(map, player1.curPOS, countFinished);

// floodFill(
//   [game.CHAR_START_POS.split('-')[0], game.CHAR_START_POS.split('-')[1]],
//   countFinishedFn
// );

/*
classes:
Player - curPos, stats, movement
Enemy - extend from Player
Map - cellCount, finishCount, accepts Player start position, create JS map and draws HTML map
*/
