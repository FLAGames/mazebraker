'use strict';

var canvas = document.getElementById('ctx');
var ctx = canvas.getContext('2d');
var x = canvas.width / 2;
var y = canvas.height - 30;
var spdX = 2;
var spdY = -2;
var ballSize = 10;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballSize, 0, Math.PI * 2);
  ctx.fillStyle = '#3498db';
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  if(x + spdX > canvas.width - ballSize || x + spdX < ballSize) {
    spdX = -spdX;
  }
  if(y + spdY > canvas.height - ballSize || y + spdY < ballSize) {
    spdY = -spdY;
  }

  x += spdX;
  y += spdY;
}

setInterval(draw, 10);
