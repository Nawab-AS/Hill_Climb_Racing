let ground = [];
let groundLength = 1000;
let offset = -100;
let hillSize = 450;

function setup() {
    createCanvas(800, 450);
    for (let i = 0; i < groundLength; i++) {
        ground.push(hillSize*noise(i/250))
    }
}

function draw() {
    background(18, 224, 211);
    beginShape();
    for (let i = 0; i < ground.length; i++) {
        vertex(i, ground[i]);
    }
    endShape();
}