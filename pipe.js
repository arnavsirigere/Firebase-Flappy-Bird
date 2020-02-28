class Pipe {
  constructor() {
    this.x = width;
    this.w = 40;
    this.spacing = 150;
    this.top = random(height - this.spacing);
    this.bottom = this.top + this.spacing;
    this.speed = 2;
    this.passed = false;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    fill(0, 255, 0);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height - this.bottom);
  }

  hits(bird) {
    if (bird.y - bird.r < this.top || bird.y + bird.r > this.bottom) {
      return bird.x + bird.r > this.x;
    }
  }
}
