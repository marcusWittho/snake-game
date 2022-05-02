const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class SnakeParts {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  };
};

const snakeParts = [];
let tailLength = 0;

let speed = 7;

let xVelocity = 0;
let yVelocity = 0;

let fruitX = 5;
let fruitY = 5;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;

let score = 0;

const gulpSound = new Audio("gulp.mp3");

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "15px verdana";
  ctx.fillText("Score: " + score, canvas.width - 100, 20);
}

function isGameOver() {
  let gameOver = false;

  if (xVelocity === 0 && yVelocity === 0) return false;

  if (headX < 0
    || headX >= tileCount
    || headY < 0
    || headY >= tileCount
  ) gameOver = true;

  for (let i = 0; i < snakeParts.length; i += 1) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    };
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "50px verdana";
    ctx.fillText("Game Over :(", canvas.width / 9, canvas.height / 2);
  }

  return gameOver;
}

function clearScreen() {
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "gray";
  for(let i = 0; i < snakeParts.length; i += 1) {
    let part = snakeParts[i];
    ctx.fillRect(
      part.x * tileCount,
      part.y * tileCount,
      tileSize,
      tileSize
    );
  }

  snakeParts.push(new SnakeParts(headX, headY));
  if (snakeParts.length > tailLength) {
    snakeParts.shift();
  }

  ctx.fillStyle = "lightgray";
  ctx.fillRect(
    headX * tileCount,
    headY * tileCount,
    tileSize,
    tileSize
  );
}

function checkFruitColision() {
  if (fruitX === headX && fruitY === headY) {
    fruitX = Math.floor(Math.random() * tileCount);
    fruitY = Math.floor(Math.random() * tileCount);
    tailLength += 1;
    score += 1;
    gulpSound.play();
  }
}

function drawFruit() {
  ctx.fillStyle = "red";
  ctx.fillRect(
    fruitX * tileCount,
    fruitY * tileCount,
    tileSize,
    tileSize
  );
}

function keyDown(event) {
  if (event.keyCode === 38) {
    if (yVelocity === 1) return;
    yVelocity = -1;
    xVelocity = 0;
  }

  if (event.keyCode === 40) {
    if (yVelocity === -1) return;
    yVelocity = 1;
    xVelocity = 0;
  }

  if (event.keyCode === 37) {
    if (xVelocity === 1) return;
    yVelocity = 0;
    xVelocity = -1;
  }

  if (event.keyCode === 39) {
    if (xVelocity === -1) return;
    yVelocity = 0;
    xVelocity = 1;
  }
}

document.body.addEventListener("keydown", keyDown);

function changeSnakePosition() {
  headX += xVelocity;
  headY += yVelocity;
}

function drawGame() {
  changeSnakePosition();

  let result = isGameOver();
  if (result) return;

  clearScreen();
  drawScore();

  checkFruitColision();

  drawFruit();
  drawSnake();
  setTimeout(drawGame, 1000 / speed);
}

drawGame();
