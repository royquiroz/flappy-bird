var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var interval;
var frames = 0;
var pipes = [];
var gravity = 5;

class Background {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.image = new Image();
    this.image.src = "./images/bg.png";
  }

  draw() {
    this.x--;
    if (this.x < -canvas.width) this.x = 0;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

class Flappy {
  constructor() {
    this.x = 20;
    this.y = 350;
    this.width = 25;
    this.height = 25;
    this.image = new Image();
    this.image.src = "./images/flappy.png";
  }

  collision(item) {
    return (
      this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  }

  draw() {
    if (this.y < canvas.height - this.height) this.y += gravity;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Pipe {
  constructor(pos, y, height) {
    this.x = canvas.width;
    this.y = y;
    this.width = 60;
    this.height = height;
    this.image = new Image();
    this.image.src =
      pos === "top"
        ? "./images/obstacle_top.png"
        : "./images/obstacle_bottom.png";
  }
  draw() {
    this.x -= 2;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

//Instancias
var fondo = new Background();
var flappy = new Flappy();

//Helpers
function start() {
  interval = setInterval(update, 1000 / 60);
}

function update() {
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fondo.draw();
  flappy.draw();
  generatePipes();
  drawPipes();
  points();
}

function gameOver() {
  clearInterval(interval);
  interval = undefined;
  ctx.font = "70px Avenir";
  ctx.fillText("Game Over", 250, 200);
  ctx.fillText("Presiona R para reiniciar", 250, 280);
}

function drawPipes() {
  pipes.forEach(pipe => {
    if (pipe.x < -canvas.width - pipe.width) return pipes.splice(index, 2);
    pipe.draw();
    if (flappy.collision(pipe)) {
      gameOver();
    }
  });
}

function generatePipes() {
  if (!(frames % 150 === 0)) return;
  var height = Math.floor(Math.random() * (canvas.height * 0.6) + 40);
  var pipe1 = new Pipe("top", 0, height);
  var pipe2 = new Pipe(
    null,
    pipe1.height + 120,
    canvas.height - pipe1.height - 120
  );
  pipes.push(pipe1);
  pipes.push(pipe2);
}

function points() {
  ctx.font = "30px Avenir";
  ctx.fillText(Math.round(frames / 60), 550, 40);
}

function restart() {
  if (interval !== undefined) return;
  pipes = [];
  interval = undefined;
  frames = 0;
  start();
}

addEventListener("keydown", function(e) {
  if (e.keyCode === 38) {
    flappy.y -= 60;
  }
  if (e.keyCode === 82) {
    restart();
  }
});

start();
