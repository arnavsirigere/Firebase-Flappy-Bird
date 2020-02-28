let bird;
let pipes = [];
let score = 0;
let counter = 0;

let databse;
let ref;

let name;
let highScore = 0;
let userId;
let userHasEntry = false;
let hasLostOnce = false;

let name_ele;
let score_ele;

function setup() {
  createCanvas(600, 400);
  bird = new Bird();
  pipes.push(new Pipe());
  name_ele = createP().style('font-size', '36px');
  score_ele = createP('').style('font-size', '36px');

  // Initialize Firebase
  firebase.initializeApp(config);
  database = firebase.database();
  ref = database.ref('scores');
  ref.on('value', newEntry, errData);
}

function draw() {
  background(51);
  bird.show();
  bird.update(pipes);
  counter++;

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();
    if (pipes[i].x < 0) {
      pipes.splice(i, 1);
    }
    if (pipes[i].hits(bird)) {
      gameOver();
    }
  }

  if (counter % 100 == 0) {
    pipes.push(new Pipe());
  }
  showScore();
  if (score > highScore) {
    highScore = score;
  }
}

function gameOver() {
  hasLostOnce = true;
  noLoop();
  if (!name) {
    name = prompt('Enter your name or intials to record your score');
    name.trim();
  }
  if (!userHasEntry) {
    let data = { name, score: highScore };
    ref.push(data);
  } else {
    database.ref(`scores/${userId}`).set({ name, score: highScore });
  }
  push();
  textSize(46);
  textAlign(CENTER, CENTER);
  fill(0);
  text('Press ENTER to Play Again.', width / 2, height / 2);
  pop();
}

function reset() {
  counter = 0;
  score = 0;
  bird = new Bird();
  pipes = [];
  pipes.push(new Pipe());
  loop();
}

function keyPressed() {
  if (key == ' ') {
    bird.jump();
  } else if (keyCode == ENTER) {
    reset();
  }
}

function errData(err) {
  console.error(err);
}

function newEntry(data) {
  let scores = data.val();
  let keys = Object.keys(scores);
  if (!userHasEntry && hasLostOnce) {
    userId = keys[keys.length - 1];
    userHasEntry = true;
  }

  let bestPlayer = scores[keys[0]];
  for (let i = 0; i < keys.length; i++) {
    if (scores[keys[i]].score > bestPlayer.score) {
      bestPlayer = scores[keys[i]];
    }
  }

  name_ele.html(`The Highest Score yet is bagged by ${bestPlayer.name} with`);
  score_ele.html(`a remarkable score of ${bestPlayer.score} points!`);
}

function showScore() {
  textSize(32);
  fill(0);
  text(`Score: ${score}`, 24, 32);
  textSize(28);
  text(`High Score: ${highScore}`, 24, 60);
}
