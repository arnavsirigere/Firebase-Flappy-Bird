class Bird {
  constructor() {
    this.x = 50;
    this.y = height / 2;
    this.r = 12;
    this.vel = 0;
    this.gravity = 0.6;
    this.lift = -10;
  }

  update(pipes) {
    // Find the closest pipe
    let closest = null;
    let closestD = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let d = pipes[i].x + pipes[i].w - this.x;
      if (d < closestD && d > 0) {
        closest = pipes[i];
        closestD = d;
      }
    }

    // Increase the score after passing the pipe
    if (this.x - this.r > closest.x) {
      // Make sure you dont extra points for passing the same one!
      if (!closest.passed) {
        score++;
        closest.passed = true;
      }
    }

    this.y = constrain(this.y, this.r, height - this.r);
    this.y += this.vel;
    this.vel += this.gravity;
    this.vel *= 0.9;
  }

  jump() {
    this.vel += this.lift;
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}
