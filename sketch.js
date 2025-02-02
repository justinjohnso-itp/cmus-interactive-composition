let trackNames = ["Drums", "Bass", "Chords"];
let shapeTypes = ["square", "triangle", "circle"]; // Assign shapes to tracks
let loops = [];
let visualizers = [];
let n = 2; // Number of alternative loops per track
let assignedKeys = ['1', '8', '2', '9', '3', '0']; // Define keys for loops
let recorder;
let player;
let analyzer = new Tone.Waveform(1024);
// player.connect(analyzer);
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
  blendMode(BLEND);
  background(0, 50);
  blendMode(DIFFERENCE);
  let minDimension = min(width, height);
  let spacing = minDimension / 8;

  for (let vis of visualizers) {
    vis.update();
    vis.display();
  }

  let waveform = analyzer.getValue();
    
  // fill(255);
  translate(width/2, height/2);
  beginShape();
  // divide the 360 degrees into equal increments
  let points = floor(analyzer.getValue().length / 36);
  for (let i = 0; i < waveform.length; i+= points) {
    // use polar coordinates
    let phi = radians(map(i, 0, waveform.length, 0, 360));
    let radius = map(waveform[i], -1, 1, 0, 4.5*spacing);
    
    // polar to cartesian    
    let x = radius * cos(phi);
    let y = radius * sin(phi);
    strokeWeight(minDimension/400);
    stroke(255,0,0);
    // noStroke();
    fill(0,0,255);
    // vertex(x, y);
    // curveVertex(x, y);
    ellipse(x,y, 10,10);
    
  }
  endShape();
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

                // let analyzer = new Tone.Waveform(1024);
                player.connect(analyzer);
                
            });
        }
    }
}

Tone.loaded().then(() => console.log('Loops Loaded'));


