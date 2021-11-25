const BOMB = '💣';
const FLAG = '🚩';
const NORMAL = '😃';
const LOSE = '🤯';
const WIN = '😎';

var gLevel = {
  size: 4,
  mines: 2,
};
var gBoard;
var gLives = 1;
var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};
var interval;
var dSettings;

// function initGame() {
//   buildBoard();
//   renderBoard(gBoard);
// }

//create the board
function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel.size; i++) {
    var row = [];
    for (var j = 0; j < gLevel.size; j++) {
      var cell = {
        i: i,
        j: j,
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      row.push(cell);
    }
    board.push(row);
  }
  for (var i = 0; i < gLevel.mines; i++) {
    var num1 = getRandomInt(0, gLevel.size);
    var num2 = getRandomInt(0, gLevel.size);
    board[num1][num2].isMine = true;
  }
  gBoard = board;
  var face = document.querySelector('.restart');
  face.innerHTML = NORMAL;
  console.log(board);
  setMinesNegsCount();
}

//renders the board
function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < gLevel.size; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < gLevel.size; j++) {
      var count = board[i][j].isShown ? board[i][j].minesAroundCount : '';

      strHTML += `<td id="${i}${j}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j})" >${count}</td>`;
    }
    strHTML += '</tr>';
  }
  var elTable = document.querySelector('.board');
  elTable.innerHTML = strHTML;
}

// checks the cell and change it to the appropriate thing
function cellClicked(elCell, i, j) {
  var face = document.querySelector('.restart');
  var liveCount = document.querySelector('.lives');
  liveCount.innerHTML = gLives;
  var element = document.getElementById(`${i}${j}`);
  if (!gGame.isOn) return;
  if (gBoard[i][j].isMarked) return;
  if (gBoard[i][j].isShown) return;
  if (gBoard[i][j].isMine) {
    elCell.innerHTML = BOMB;
    gBoard[i][j].isShown = true;
    gLives--;
    gGame.shownCount++;
    face.innerHTML = LOSE;
  } else {
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    face.innerHTML = NORMAL;
    element.classList.add('isShown');
    renderCell(gBoard[i][j], gBoard[i][j].minesAroundCount);
  }

  console.log(gBoard);
  var count = document.querySelector('.shownCount');
  count.innerHTML = gGame.shownCount;
  checkGameOver();
}

// markes and unmarkes a cell
function cellMarked(elCell, i, j) {
  event.preventDefault();
  var element = document.getElementById(`${i}${j}`);
  if (!gGame.isOn) return;
  if (gBoard[i][j].isShown) return;
  if (!gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = true;
    elCell.innerHTML = FLAG;
    gGame.markedCount++;
    element.classList.add('isMarked');
  } else {
    gBoard[i][j].isMarked = false;
    elCell.innerHTML = '';
    gGame.markedCount--;
    element.classList.remove('isMarked');
  }
  var count = document.querySelector('.markedCount');
  count.innerHTML = gGame.markedCount;
  checkGameOver();
}

// checks if the game is over
function checkGameOver() {
  var face = document.querySelector('.restart');
  var count = gLevel.size * gLevel.size - gLevel.mines;
  if (
    (gGame.shownCount === count && gGame.markedCount === gLevel.mines) ||
    (gGame.shownCount > count &&
      gGame.markedCount < gLevel.mines &&
      gGame.shownCount + gGame.markedCount === gLevel.size * gLevel.size)
  ) {
    alert('you win');
    gGame.isOn = false;
    face.innerHTML = WIN;
    clearInterval(interval);
  } else if (gLives === 0) {
    alert('you lose');
    gGame.isOn = false;
    face.innerHTML = LOSE;
    clearInterval(interval);
  }
}

function setMinesNegsCount() {
  for (var i = 0; i < gLevel.size; i++) {
    for (var j = 0; j < gLevel.size; j++) {
      countNegs(i, j);
    }
  }
}

//counts mines Around the cell
function countNegs(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    console.log(cellI);
    console.log(i);
    if (i < 0 || i > gLevel.size - 1) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      console.log(cellJ);
      console.log(j);
      if (j < 0 || j > gLevel.size - 1) continue;
      if (i === 0 && j === 0) continue;
      if (gBoard[i][j].isMine) gBoard[cellI][cellJ].minesAroundCount++;
    }
  }
}

//renders only 1 cell and not the whole board
function renderCell(location, value) {
  var elCell = document.getElementById(`${location.i}${location.j}`);
  elCell.innerHTML = value;
  if (value === 0) {
    elCell.innerHTML = '';
    showArond(location);
  }
}

function showArond(location) {
  for (var i = location.i - 1; i <= location.i + 1; i++) {
    if (i < 0 || i > gLevel.size - 1) continue;
    for (var j = location.j - 1; j <= location.j + 1; j++) {
      if (j < 0 || j > gLevel.size - 1) continue;
      if (i === location.i && j === location.j) continue;
      openArond(i, j);
    }
  }
}

function openArond(i, j) {
  var element = document.getElementById(`${i}${j}`);
  if (!gGame.isOn) return;
  if (gBoard[i][j].isMarked) return;
  if (gBoard[i][j].isShown) return;
  if (gBoard[i][j].isMine) {
    elCell.innerHTML = BOMB;
    gBoard[i][j].isShown = true;
    gLives--;
    gGame.shownCount++;
  } else {
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    element.classList.add('isShown');
    renderCell(gBoard[i][j], gBoard[i][j].minesAroundCount);
  }

  console.log(gBoard);
  var count = document.querySelector('.shownCount');
  count.innerHTML = gGame.shownCount;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function restartGame() {
  difficulty(dSettings.size, dSettings.mines, dSettings.lives);
}

//change the difficulty
function difficulty(size, mines, lives) {
  gLevel.size = size;
  gLevel.mines = mines;
  gLives = lives;
  gGame.isOn = true;
  gGame.markedCount = 0;
  gGame.shownCount = 0;
  dSettings = {
    size: size,
    mines: mines,
    lives: lives,
  };
  buildBoard();
  renderBoard(gBoard);
  clearInterval(interval);
  timer();
}
function timer() {
  var startTime = Date.now();
  interval = setInterval(function () {
    var elapsedTime = Date.now() - startTime;
    document.querySelector('.secsPassed').innerHTML = (
      elapsedTime / 1000
    ).toFixed(1);
  }, 100);
}
