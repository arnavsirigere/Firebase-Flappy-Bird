let bird;
let pipes = [];
let score = 0;
let counter = 0;
let nWinners = 5; // N top people to come on the leaderboard

let databse;
let ref;

let name;
let highScore = 0;
let userId;
let userHasEntry = false;
let hasLostOnce = false;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('canvas');
  let leaderboard = document.getElementById('leaderboard-container');
  let h1 = document.createElement('h1');
  h1.textContent = 'Leaderboard';
  h1.style.textAlign = 'center';
  h1.style.textDecoration = 'underline';
  leaderboard.appendChild(h1);
  let table = document.createElement('table');
  table.classList.add('leaderboard');
  leaderboard.appendChild(table);
  // Create bird and pipe
  bird = new Bird();
  pipes.push(new Pipe());
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
    name = name.trim();
  }
  if (name) {
    if (!userHasEntry) {
      let data = { name, score: highScore };
      ref.push(data);
    } else {
      database.ref(`scores/${userId}`).set({ name, score: highScore });
    }
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

function mousePressed() {
  bird.jump();
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
  // Adding users to leaderboard
  let scoresArr = getLeaderboard(scores, keys, nWinners);
  let table = document.querySelector('.leaderboard');
  table.innerHTML = '';
  for (let i = 0; i < scoresArr.length; i++) {
    let { name, score } = scoresArr[i];
    let row = table.insertRow(i);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    cell1.textContent = name;
    cell2.textContent = score;
    cell1.classList.add('name-cell');
    cell2.classList.add('score-cell');
    cell1.style.fontWeight = i == 0 ? 'bold' : 'none';
    cell2.style.fontWeight = i == 0 ? 'bold' : 'none';
    cell1.style.fontSize = i == 0 ? '36px' : '24px';
    cell2.style.fontSize = i == 0 ? '36px' : '24px';
    cell1.style.background = i == 0 ? 'gold' : i % 2 == 1 ? 'cyan' : 'lime';
    cell2.style.background = i == 0 ? 'gold' : i % 2 == 1 ? 'cyan' : 'lime';
  }
}

function showScore() {
  textSize(32);
  fill(0);
  text(`Score: ${score}`, 24, 32);
  textSize(28);
  text(`High Score: ${highScore}`, 24, 60);
}

function getLeaderboard(scores, keys, n) {
  let arr = [];
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    arr.push({ name: scores[key].name, score: scores[key].score });
  }
  arr = arr.sort((a, b) => b.score - a.score).splice(0, n);
  return arr;
}
