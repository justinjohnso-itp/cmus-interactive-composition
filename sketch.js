let trackNames = ["Drums", "Bass", "Chords"];
let shapeTypes = ["square", "triangle"]; // Assign shapes to tracks
let loops = [];
let visualizers = [];
let n = 2; // Number of alternative loops per track
let assignedKeys = ['1', '8', '2', '9', '3', '0']; // Define keys for loops
let recorder;
let player;
let isRecording = false;
let angle = 0;
let cval = 0;
let direction = 1;

function setup() {  
  createCanvas(windowWidth,windowHeight);  
  loadLoops();
      // Start audio context
    Tone.start();
    
    // Create recorder
    recorder = new Tone.Recorder();
    
    // Connect microphone to recorder
    const mic = new Tone.UserMedia();
    mic.open().then(() => {
        mic.connect(recorder);
        console.log('Microphone ready');
    }).catch(e => {
        console.log('Error opening microphone:', e);
    });
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw(){
  // blendMode(BLEND);
  background(100);
  // blendMode(DIFFERENCE);
  
  for (let vis of visualizers) {
    vis.update();
    vis.display();
  }
//   let c1 = color(cval, 0, 255 - cval);
//   let c2 = color(255 - cval, 0, cval);

//   // Update color over time
//   // Update cval smoothly between 0 and 255

//   cval += direction;
//   if (cval >= 255 || cval <= 0) {
//     direction *= -1; // Reverse direction when hitting limits
//   }

//   let minDimension = min(width, height);
//   let spacing = minDimension / 8;
//   let x = width / 2;
//   let y = height / 2;
//   let amount1 = sin(angle) / 2 + 0.6;
//   let amount2 = cos(angle) / 2 + 0.6;

//   let thickness = (minDimension / 20);
//   strokeWeight(thickness);

//   push();
//   stroke(255 - cval, 0, cval);
//   fill(cval, 255 - cval, 0);
//   translate(x, y); // rotate about center of canvas
//   rectMode(CENTER); // rotate square around its center point
//   rotate(angle); // clockwise
//   rect(0, 0, spacing * 3, spacing * 3);
//   pop();

//   // push();
//   // translate(x, y); // rotate about center of canvas
//   // rectMode(CENTER);
//   // stroke(255 - cval, 0, cval);
//   // fill(cval, 255 - cval, 0);
//   // // stroke(cval, 0, 255 - cval);
//   // // fill(255 - cval, 0, cval);
//   // rotate(-angle); // counterclockwise
//   // rect(0, 0, spacing * 3 * amount2, spacing * 3 * amount2);
//   // pop();

//   // angle += 0.03; // set speed of rotation
}

function loadLoops() {  
  Tone.Transport.bpm.value = 122;
  let keyIndex = 0;

  for (let i = 0; i < trackNames.length; i++) {    
    let x = 100;
    let y = i * 100 + 50;
    let shapeType = shapeTypes[i];
    let visualizer = new TrackVisualizer(x, y, shapeType);
    visualizers.push(visualizer);

    loops[i] = [];
    for (let j = 0; j < n; j++) {
      let name = trackNames[i] + " " + j;
      let key = assignedKeys[keyIndex % assignedKeys.length];
      keyIndex++;
      loops[i][j] = new Loop("loops/" + trackNames[i] + j + ".mp3", i, j, name, key, visualizer);
    }

    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        if (j !== k) {
          loops[i][j].siblings.push(loops[i][k]);
        }
      }
    }
  }
}


function keyPressed() {
  for (let i = 0; i < loops.length; i++) {
    for (let j = 0; j < loops[i].length; j++) {
      if (key.toUpperCase() === loops[i][j].key) {
        loops[i][j].toggle();
      }
    }
  }
  
   if (keyCode === 32) { // Space key
        if (!isRecording) {
            // Start recording
            recorder.start();
            isRecording = true;
            console.log('Recording started');
        } else {
            // Stop recording and play back
            isRecording = false;
            console.log('Recording stopped');
            
            recorder.stop().then(recording => {
                // Create a new blob URL from the recording
                const url = URL.createObjectURL(recording);
                
                // If there's an existing player, stop and dispose of it
                if (player) {
                    player.stop();
                    player.dispose();
                }
                
                // Create a new player with the recording
                player = new Tone.Player({
                    url: url,
                    loop: true,
                    autostart: true
                }).toDestination();
                
            });
        }
    }
}

Tone.loaded().then(() => console.log('Loops Loaded'));


