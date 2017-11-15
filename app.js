'use strict';

var ctx = document.getElementById('ctx').getContext('2d');
ctx.font = '15px "Press Start 2p"';

var HEIGHT = 700;
var WIDTH = 700;
var NUMBLOCKS = 100;
var block = [];
var points = 0;
var lives = 3;
var userName = prompt('Hey! What\'s your name');
var userScores = [];
var mouseOn;
var padSpeed = 20;
var ballSpeed = 4;
var paused = false;

// Constructor for paddles
function Paddle(x, y, spdX, spdY, width, height, color) {
  this.x = x;
  this.y = y;
  this.spdX = spdX;
  this.sdpY = spdY;
  this.width = width;
  this.height = height;
  this.color = color;
};

// Create adio objects
var bounceSound = new Audio('assets/sfx/Spring.wav');
var hitSound = new Audio('assets/sfx/hitsound.mp3');

// Preload audio objects so that we can play as fast as we need to
hitSound.preload = 'auto';
hitSound.load();
bounceSound.preload = 'auto';
bounceSound.load();

// funciton to play sound takes an audio objects as an argument
function playSound(sfx) {
  var sound = sfx.cloneNode();
  sound.play();
}

function Ball(id, x, y, spdX, spdY) {
  this.x = x;
  this.y = y;
  this.spdX = spdX;
  this.spdY = spdY;
  this.ballSize = 10;
};

var ball = new Ball(1, WIDTH / 2, HEIGHT - 30, 4, -4);
var playerTop = new Paddle(350, 5, 30, 10, 60, 10, '#2ecc71');
var playerBottom = new Paddle(350, 695, 30, 10, 60, 10, '#2ecc71');
var playerLeft = new Paddle(5, 350, 30, 10, 10, 60, '#2ecc71');
var playerRight = new Paddle(695, 350, 30, 10, 10, 60, '#2ecc71');

var updateEntity = function(something) {
  updateEntityPosition(something);
  drawEntity(something);
};

var updateEntityPosition = function(something) {
  something.x += something.spdX;
  something.y += something.spdY;
  if (something.x < 0 || something.x > WIDTH) {
    something.spdX = -something.spdX;
  }
  if (something.y < 0 || something.y > HEIGHT) {
    something.spdY = -something.spdY;
  }
};

var drawEntity = function(something) {
  ctx.save();
  ctx.fillStyle = something.color;
  ctx.fillRect(something.x - something.width / 2, something.y - something.height / 2, something.width, something.height);
  ctx.restore();
};

var drawBall = function() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.ballSize, 0, Math.PI * 2);
  ctx.fillStyle = '#3498db';
  ctx.fill();
  ctx.closePath();
};

//Create Blocks
var Blocks = function(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
};

var drawBlocks = function() {
  for (var b = 0; b < block.length; b++) {
    ctx.fillStyle = '#3498db';
    ctx.fillRect(block[b].x - block[b].width / 2, block[b].y - block[b].height / 2, block[b].width, block[b].height);
  }
};

// ball/brick colision detection:
var getDistanceBetweenEntity = function(entity1, entity2) { //return distance (number)
  var vx = entity1.x - entity2.x;
  var vy = entity1.y - entity2.y;
  return Math.sqrt(vx * vx + vy * vy);
};

var testCollisionEntity = function(entity1, entity2) { //return if colliding (true/false)
  var distance = getDistanceBetweenEntity(entity1, entity2);
  return distance < 20;
};

var Img = {};
Img.block = new Image();
Img.block.src = 'assets/vfx/40px_SpriteSheet.png';
Img.block.height = 20;
Img.block.width = 20;

var updateCollisionBlock = function() {
  for (var key = 0; key < block.length; key++) {
    var isColliding = testCollisionEntity(ball, block[key]);
    if (isColliding) {
      var blockVFX = function(){
        ctx.save();
        ctx.drawImage(Img.block,block[key].x,block[key].y);
      };
      // Code for redirecting ball direction
      // Ball needs to bounce in a logical way off blocks.  If ball is approaching from side, reverse ball.spdX. If ball is approaching from top or bottom, reverse ball.spdY
      // If the difference between the two entitys' xs is lower than the two entitys' ys, then the ball and the brick are on or close to the same x plane, and must be bounced horizontally, aka reverse ball.spdX
      blockVFX();
      var xDiff = Math.abs(ball.x - block[key].x);
      var yDiff = Math.abs(ball.y - block[key].y);
      if (xDiff < yDiff) { // reverse ball's horizontal direction
        ball.spdX = -ball.spdX;
      } else { // reverse vertically
        ball.spdY = -ball.spdY;
      }
      // In our code, remove block[key]
      // To do this, block[key] = block[key+1], block[key+1] = block[key+2], etc. then  block.pop()
      for (var r = key; r < block.length; r++) {
        block[r] = block[r + 1];
      }
      block.pop();
      playSound(hitSound);
      points++;

    }
  }
};

(function() {
  var form, options;
  form = document.getElementById('mouse-option');
  options = form.elements.mouseOp;
  for (var i = [0]; i < options.length; i++) {
    addEvent(options[i], 'click', radioChanged);
  }

  function radioChanged() {
    hide = other.checked ? '' : hide;
    otherText.value = '';
  }
});
var form = document.getElementById('mouse-option');
var offButton = document.getElementById('off');

var getXY = function() {
  var canvas = document.getElementById('ctx');
  var rect = canvas.getBoundingClientRect(); //absolute position of canvas
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

document.onmousemove = function(mouse) {
  offButton.blur();
  if (mouseOn == 'on') {

    var pos = getXY();
    var mouseX = pos.x;
    var mouseY = pos.y;

    playerTop.x = mouseX;
    playerBottom.x = mouseX;
    playerRight.y = mouseY;
    playerLeft.y = mouseY;
  }
};

document.onkeydown = function(event) {
  if (event.keyCode === 68 || event.keyCode === 39) { //d or Right arrow
    playerBottom.pressingRight = true;
    playerTop.pressingRight = true;
  } else if (event.keyCode === 83 || event.keyCode === 40) { //s or Down arrow
    playerLeft.pressingDown = true;
    playerRight.pressingDown = true;
  } else if (event.keyCode === 65 || event.keyCode === 37) { //a or Left arrow
    playerBottom.pressingLeft = true;
    playerTop.pressingLeft = true;
  } else if (event.keyCode === 87 || event.keyCode === 38) { // w or Up Arrow
    playerLeft.pressingUp = true;
    playerRight.pressingUp = true;
  } else if (event.keyCode === 80) { //p
    paused = !paused;
  }
};

document.onkeyup = function(event) {
  if (event.keyCode === 68 || event.keyCode === 39) { //d or Right arrow
    playerBottom.pressingRight = false;
    playerTop.pressingRight = false;
  } else if (event.keyCode === 83 || event.keyCode === 40) { //s or Down arrow
    playerLeft.pressingDown = false;
    playerRight.pressingDown = false;
  } else if (event.keyCode === 65 || event.keyCode === 37) { //a or Left arrow
    playerBottom.pressingLeft = false;
    playerTop.pressingLeft = false;
  } else if (event.keyCode === 87 || event.keyCode === 38) { // w or Up Arrow
    playerLeft.pressingUp = false;
    playerRight.pressingUp = false;
  }
};

var updatePlayerBottomPosition = function() {
  if (playerBottom.pressingRight)
    playerBottom.x += padSpeed;
  if (playerBottom.pressingLeft)
    playerBottom.x -= padSpeed;
  //ispositionvalid
  if (playerBottom.x < playerBottom.width / 2)
    playerBottom.x = playerBottom.width / 2;
  if (playerBottom.x > WIDTH - playerBottom.width / 2)
    playerBottom.x = WIDTH - playerBottom.width / 2;
};

var updatePlayerTopPosition = function() {
  if (playerTop.pressingRight)
    playerTop.x += padSpeed;
  if (playerTop.pressingLeft)
    playerTop.x -= padSpeed;
  //ispositionvalid
  if (playerTop.x < playerTop.width / 2)
    playerTop.x = playerTop.width / 2;
  if (playerTop.x > WIDTH - playerTop.width / 2)
    playerTop.x = WIDTH - playerTop.width / 2;
};

var updatePlayerLeftPosition = function() {
  if (playerLeft.pressingDown)
    playerLeft.y += padSpeed;
  if (playerLeft.pressingUp)
    playerLeft.y -= padSpeed;
  //ispositionvalid
  if (playerLeft.y < playerLeft.height / 2)
    playerLeft.y = playerLeft.height / 2;
  if (playerLeft.y > HEIGHT - playerLeft.height / 2)
    playerLeft.y = HEIGHT - playerLeft.height / 2;
};

var updatePlayerRightPosition = function() {
  if (playerRight.pressingDown)
    playerRight.y += padSpeed;
  if (playerRight.pressingUp)
    playerRight.y -= padSpeed;
  //ispositionvalid
  if (playerRight.y < playerRight.height / 2)
    playerRight.y = playerRight.height / 2;
  if (playerRight.y > HEIGHT - playerRight.height / 2)
    playerRight.y = HEIGHT - playerRight.height / 2;
};

function sortNumber(a, b) {
  return b['score'] - a['score'];
}

function renderScore() {
  userScores = JSON.parse(window.localStorage.getItem('User Data')) || [];
  userScores.sort(sortNumber);
  var playerColumn = document.getElementById('player-column');
  var scoreColumn = document.getElementById('score-column');

  for (var i = 0; i < userScores.length; i++) {
    var playerName = document.createElement('div');
    var playerScore = document.createElement('div');

    playerName.className = 'player-name';
    playerScore.className = 'player-score';

    playerName.textContent = userScores[i]['user name'];
    playerScore.textContent = userScores[i]['score'];
    playerColumn.appendChild(playerName);
    scoreColumn.appendChild(playerScore);
  }
}
renderScore();

function setScore() {
  userScores = JSON.parse(window.localStorage.getItem('User Data')) || [];
  var userScore = {
    'user name': userName,
    'score': points
  };

  var existingUser = userScores.findIndex(function(element) {
    return element['user name'] === userName;
  });

  console.log(existingUser);
  if (existingUser === -1) {
    userScores.push(userScore);
  } else if (points > userScores[existingUser]['score']) {
    userScores[existingUser]['score'] = points;
  }

  window.localStorage.setItem('User Data', JSON.stringify(userScores));
}

var updateBallPosition = function() {
  var ballReset = function() {
    ball.x = WIDTH / 2;
    ball.y = HEIGHT - 30;
    ball.spdX = ballSpeed;
    ball.spdY = -ballSpeed;
  };

  // if (!lives) {
  //   setScore();
  //   alert('GAME OVER');
  //   lives = 3;
  //   document.location.reload();
  // }

  if (ball.x < ball.ballSize * 2) {
    if (ball.y > playerLeft.y - (playerLeft.height / 2) && ball.y < playerLeft.y + (playerLeft.height / 2) && ball.x > playerLeft.x - (playerLeft.width * 2)) {
      ball.spdX = -ball.spdX;
      playSound(bounceSound);
    } else {
      lives--;
      ballReset();
    }
  }
  if (ball.x > WIDTH - ball.ballSize * 2) {
    if (ball.y > playerRight.y - (playerRight.height / 2) && ball.y < playerRight.y + (playerRight.height / 2) && ball.x < playerRight.x + (playerRight.width * 2)) {
      ball.spdX = -ball.spdX;
      playSound(bounceSound);
    } else {
      lives--;
      ballReset();
    }
  }
  if (ball.y < ball.ballSize * 2) {
    if (ball.x > playerTop.x - (playerTop.width / 2) && ball.x < playerTop.x + (playerTop.width / 2) && ball.y < playerTop.y + (playerTop.height * 2)) {
      ball.spdY = -ball.spdY;
      playSound(bounceSound);
    } else {
      lives--;
      ballReset();
    }
  }
  if (ball.y > HEIGHT - ball.ballSize * 2) {
    if (ball.x > playerBottom.x - (playerBottom.width / 2) && ball.x < playerBottom.x + (playerBottom.width / 2) && ball.y > playerBottom.y - (playerBottom.height * 2)) {
      ball.spdY = -ball.spdY;
      playSound(bounceSound);
    } else {
      lives--;
      ballReset();
    }
  }
  ball.x += ball.spdX;
  ball.y += ball.spdY;
};

var update = function() {
  if(paused){
    return;
  };
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillText(points + ' Points', 5, 30);
  ctx.fillText(lives + ' lives', 590, 30);
  updatePlayerTopPosition();
  drawEntity(playerTop);
  updatePlayerBottomPosition();
  drawEntity(playerBottom);
  updatePlayerLeftPosition();
  drawEntity(playerLeft);
  updatePlayerRightPosition();
  drawEntity(playerRight);
  updateBallPosition();
  drawBall();
  drawBlocks();
  updateCollisionBlock();
  //console.log('form.element.mouseOp =', form.elements.mouseOp);
  mouseOn = form.elements.mouseOp.value;
};
setInterval(update, 40);

//freemusicarchive.org
function generatePlayer(music){
  document.write('<audio id=\"player\" src=' + music + ' autoplay loop>');
};
var mPath = 'assets/music/';
var mList = [
  'Kalipluche_-_Social_sentiments_8-bit_mix.mp3',
  'Nctrnm_-_04_-_Cool_It.mp3',
  'Podington_Bear_-_The_Confrontation.mp3',
  'Ian_Sutherland_-_19_-_Resolve.mp3',
  'Ian_Sutherland_-_13_-_Coraline.mp3',
];
function pickMusic(){
  var i = Math.floor(Math.random() * mList.length);
  generatePlayer(mPath + mList[i]);
};
pickMusic();

//canvas sprite animation https://www.youtube.com/watch?v=W0e9Z5pmt-I
