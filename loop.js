class Loop {
  constructor(url, trackIndex, loopIndex, name, key, parentVisualizer) {
    this.player = new Tone.Player({
      url: url,
      loop: true,
    });
    this.player.toDestination();
    this.quantize = "@1m";
    this.siblings = [];
    this.key = key; // Assigned key
    this.parentVisualizer = parentVisualizer; // Reference to visualizer
  }

  toggle() {
    if (Tone.Transport.state != "started") {
      Tone.start();
      Tone.Transport.start();
    }
    if (this.player.state == "started") {
      this.scheduleStop();
    } else {
      this.scheduleStart();
    }
  }

  start() {
    this.parentVisualizer.activeLoop = this; // Update visualizer
  }

  stop() {
    if (this.parentVisualizer.activeLoop === this) {
      this.parentVisualizer.activeLoop = null; // Reset if stopped
    }
  }

  scheduleStart() {
    this.player.start(this.quantize);
    for (const sibling of this.siblings) {
      if (sibling.player.state == "started") {
        sibling.scheduleStop();
      }
    }
    this.start();
  }

  scheduleStop() {
    this.player.stop(this.quantize);
    this.stop();
  }
}

class TrackVisualizer {
  constructor(x, y, shapeType) {
    this.x = x;
    this.y = y;
    this.shapeType = shapeType;
    this.activeLoop = null; // Tracks which loop is active
    this.angle = 0;
    // this.amount = ;
  }

  update() {
    let minDimension = min(width, height);
    let spacing = minDimension / 8;
    strokeWeight(minDimension / 50);

    if (this.activeLoop) {
      if (this.shapeType === "square") {
        this.angle += 0.05; // Rotate
      } else if (this.shapeType === "triangle") {
        this.angle += 0.05; // Rotate
      } else if (this.shapeType === "circle") {
        this.angle += 0.05; // Rotate
      }
    }
  }

  display() {
    let minDimension = min(width, height);
    let spacing = minDimension / 8;
    strokeWeight(minDimension / 50);

    push();
    translate(width / 2, height / 2);
    if (this.shapeType === "square") {
      stroke(0, 255, 0);
      fill(0, 0, 0);
      rectMode(CENTER); // rotate square around its center point
      rotate(this.angle); // clockwise
      rect(0, 0, spacing * 5, spacing * 5);
    } else if (this.shapeType === "triangle") {
      stroke(0, 255, 0);
      fill(0, 0, 255);
      rotate(-this.angle); // counterclockwise
      triangle(
        0,
        -2 * spacing,
        -1.75 * spacing,
        1 * spacing,
        1.75 * spacing,
        1 * spacing
      );
    } else if (this.shapeType === "circle") {
      stroke(255, 0, 0);
      fill(0, 0, 255);
      circle(0, 0, spacing * (sin(this.angle) / 2 + 1));
    }

    pop();
  }
}
