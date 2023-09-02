// by SamuelYAN
// more works //
// https://twitter.com/SamuelAnn0924
// https://www.instagram.com/samuel_yan_1990/

let conVerse;

let sounds = [];
let chat_num;

let ito_num, point_num;
let seed = Math.random() * 99999;
let mySize, margin;
let tile_x, tile_y;
let tile_x_size, tile_y_size;
let boardWidth, boardHeight;

// colors
let colors_dark = "321E1E-27374D-116D6E-5F264A-2C3639-191A19"
  .split("-")
  .map((a) => "#" + a);
let colors_light =
  "EEE3CB-F9F5F6-FBFFDC-F8E8EE-E3F4F4-C1D0B5-FEA1A1-FFD966-FADA9D"
    .split("-")
    .map((a) => "#" + a);

let colors0 = "281914-1a1a1a-202020-242e30".split("-").map((a) => "#" + a);
let colors1 = "fef9fb-fafdff-ffffff-fcfbf4-f9f8f6"
  .split("-")
  .map((a) => "#" + a);
let colors2 =
  "f4c815-f9cad7-A57283-c1d5de-deede6-f7f6cf-b6d8f2-f4cfdf-9ac8eb-ccd4bf-e7cba9-eebab2-f5f3f7-f5e2e4-AAD9CD-E8D595-E9BBB5-E7CBA9-8DA47E"
    .split("-")
    .map((a) => "#" + a);
let color1, color2;
let plus;

//new tone
let newTone01 = "FF9494-FFD1D1-FFE3E1-FFF5E4".split("-").map((a) => "#" + a);
let newTone02 = "967E76-D7C0AE-EEE3CB-B7C4CF".split("-").map((a) => "#" + a);
let newTone03 = "EEF1FF-D2DAFF-AAC4FF-B1B2FF".split("-").map((a) => "#" + a);
let newTone04 = "E38B29-F1A661-FFD8A9-FDEEDC".split("-").map((a) => "#" + a);
let newTone05 = "FFC3A1-F0997D-D3756B-A75D5D".split("-").map((a) => "#" + a);
let newTone06 = "374259-545B77-5C8984-F2D8D8".split("-").map((a) => "#" + a);

function preload() {
  // conVerse = loadJSON("data.json");
  let datas = localStorage.getItem("dataList");
  conVerse = JSON.parse(datas);
  let boardSize = localStorage.getItem("boardSize");
  boardSize = JSON.parse(boardSize);
  boardWidth = boardSize.width;
  boardHeight = boardSize.height;
  console.log("boardWidth : " + boardWidth);
  console.log("boardHeight : " + boardHeight);
}

function setup() {
  frameRate(50);
  randomSeed(seed);
  mySize = min(windowWidth, windowHeight);
  margin = mySize / 100;
  createCanvas(windowWidth, windowHeight);

  chat_num = Object.keys(conVerse).length;
  for (let i = 0; i < chat_num; i++) {
    sounds[i] = new conVerse_chat(conVerse[i]);
  }

  color1 = random(colors_light);
  makeFilter();
  background(random(colors_light));
}

function draw() {
  randomSeed(seed);
  noiseSeed(seed);

  for (let i = 0; i < sounds.length; i++) {
    sounds[i].display();
    sounds[i].update();
  }

  if (frameCount < 300) {
    image(overAllTexture, 0, 0);
  }

  if (frameCount > 1200) {
    noLoop();
    blendMode(BLEND);
    image(overAllTexture, 0, 0);
    blendMode(SCREEN);
    strokeWeight(random(0.1, 0.5) / 2);
    stroke(str(random(colors_dark)) + "1a");
    noFill();
    drawingContext.setLineDash([1, 4, 1, 3]);
    drawOverPattern();
    drawingContext.setLineDash([]);
    blendMode(BLEND);

    noFill();
    strokeWeight(margin);
    rectMode(CORNER);
    stroke("#202020");
    rect(0, 0, width, height);
  }
}

class conVerse_chat {
  constructor(v) {
    // this.x = v.pos.x;
    // this.y = v.pos.y;
    this.x = map(v.pos.x, 0, boardWidth, 0, width);
    this.y = map(v.pos.y, 0, boardHeight, 0, height);
    this.color = v.color;
    this.date = v.date;
    this.time = v.time;
    this.plus = 0;
    this.point_num = 2;
    this.angle = random(TAU) + random([0, PI / 2, PI, (PI / 2) * 3]);
    this.size = mySize * random(0.25, 0.75);
  }

  display() {
    randomSeed(seed * this.plus);
    push();
    translate(this.x, this.y);

    rotate(
      this.angle + (random([-1, 1]) * 50 * 40 * this.plus) / this.point_num
    );
    noFill();
    stroke(str(this.color) + "80");

    drawingContext.shadowColor = str(random(colors_dark)) + "80";
    drawingContext.shadowOffsetX = 0.45;
    drawingContext.shadowOffsetY = 0.45;
    drawingContext.shadowBlur = 0;

    strokeWeight(this.plus / 100);
    circle(0, 0, this.plus * 12);

    strokeWeight(random(0.55, 0.35) * random(1, 3) + (2.0 * this.plus) / 50);
    beginShape();
    for (let x = -this.size; x < this.size; x += this.size / this.point_num) {
      let n = noise(x * 0.1, this.plus * 0.1, frameCount * 0.001);
      let y = map(n, 0, 1, -this.size * 0.25, this.size * 0.25);
      // if (x > this.size / this.point_num) {
      point(x, y);
      // }
    }
    endShape();

    pop();
  }

  update() {
    this.plus += random(2, 1) * random(0.01, 0.005);
    if (frameCount % 10 == 0) {
      this.point_num += 5;
    }
  }
}
