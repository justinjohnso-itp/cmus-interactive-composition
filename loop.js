class Loop {
  constructor(url, trackIndex, loopIndex, name, key, parentVisualizer) {
    this.player = new Tone.Player({
      url: url,
      loop: true
    });
    this.player.toDestination();
    this.quantize = "@1m";
    this.siblings = [];
    this.key = key;  // Assigned key
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
      if (sibling.player.state == 'started') {
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
    this.size = 40;
  }

  update() {
    if (this.activeLoop) {
      if (this.shapeType === "square") {
        this.angle += 0.05; // Rotate
      } else if (this.shapeType === "triangle") {
        this.size = lerp(this.size, 60, 0.1); // Grow
      }
    } else {
      if (this.shapeType === "triangle") {
        this.size = lerp(this.size, 40, 0.1); // Shrink back
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    if (this.shapeType === "square") {
      rotate(this.angle);
      rectMode(CENTER);
      fill(this.activeLoop ? 'black' : 'white');
      stroke(0);
      rect(0, 0, 50, 50);
    } else if (this.shapeType === "triangle") {
      fill(this.activeLoop ? 'red' : 'white');
      stroke(0);
      triangle(-this.size / 2, this.size / 2, 
                this.size / 2, this.size / 2, 
                0, -this.size / 2);
    }
    pop();
  }
}
