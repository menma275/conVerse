"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// by SamuelYAN
// more works //
// https://twitter.com/SamuelAnn0924
// https://www.instagram.com/samuel_yan_1990/
var conVerse;
var sounds = [];
var chat_num;
var ito_num, point_num;
var seed = Math.random() * 99999;
var mySize, margin;
var tile_x, tile_y;
var tile_x_size, tile_y_size;
var boardWidth, boardHeight; // colors

var colors_dark = "321E1E-27374D-116D6E-5F264A-2C3639-191A19".split("-").map(function (a) {
  return "#" + a;
});
var colors_light = "EEE3CB-F9F5F6-FBFFDC-F8E8EE-E3F4F4-C1D0B5-FEA1A1-FFD966-FADA9D".split("-").map(function (a) {
  return "#" + a;
});
var colors0 = "281914-1a1a1a-202020-242e30".split("-").map(function (a) {
  return "#" + a;
});
var colors1 = "fef9fb-fafdff-ffffff-fcfbf4-f9f8f6".split("-").map(function (a) {
  return "#" + a;
});
var colors2 = "f4c815-f9cad7-A57283-c1d5de-deede6-f7f6cf-b6d8f2-f4cfdf-9ac8eb-ccd4bf-e7cba9-eebab2-f5f3f7-f5e2e4-AAD9CD-E8D595-E9BBB5-E7CBA9-8DA47E".split("-").map(function (a) {
  return "#" + a;
});
var color1, color2;
var plus; //new tone

var newTone01 = "FF9494-FFD1D1-FFE3E1-FFF5E4".split("-").map(function (a) {
  return "#" + a;
});
var newTone02 = "967E76-D7C0AE-EEE3CB-B7C4CF".split("-").map(function (a) {
  return "#" + a;
});
var newTone03 = "EEF1FF-D2DAFF-AAC4FF-B1B2FF".split("-").map(function (a) {
  return "#" + a;
});
var newTone04 = "E38B29-F1A661-FFD8A9-FDEEDC".split("-").map(function (a) {
  return "#" + a;
});
var newTone05 = "FFC3A1-F0997D-D3756B-A75D5D".split("-").map(function (a) {
  return "#" + a;
});
var newTone06 = "374259-545B77-5C8984-F2D8D8".split("-").map(function (a) {
  return "#" + a;
});

function preload() {
  // conVerse = loadJSON("data.json");
  var datas = localStorage.getItem("dataList");
  conVerse = JSON.parse(datas);
  var boardSize = localStorage.getItem("boardSize");
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

  for (var i = 0; i < chat_num; i++) {
    sounds[i] = new conVerse_chat(conVerse[i]);
  }

  color1 = random(colors_light);
  makeFilter();
  background(random(colors_light));
}

function draw() {
  randomSeed(seed);
  noiseSeed(seed);

  for (var i = 0; i < sounds.length; i++) {
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

var conVerse_chat =
/*#__PURE__*/
function () {
  function conVerse_chat(v) {
    _classCallCheck(this, conVerse_chat);

    // this.x = v.pos.x;
    // this.y = v.pos.y;
    this.x = map(v.pos.x - 2500 + boardWidth / 2, 0, boardWidth, 0, width);
    this.y = map(v.pos.y - 2500 + boardHeight / 2, 0, boardHeight, 0, height);
    this.color = v.color;
    this.date = v.date;
    this.time = v.time;
    this.plus = 0;
    this.point_num = 2;
    this.angle = random(TAU) + random([0, PI / 2, PI, PI / 2 * 3]);
    this.size = mySize * random(0.25, 0.75);
  }

  _createClass(conVerse_chat, [{
    key: "display",
    value: function display() {
      randomSeed(seed * this.plus);
      push();
      translate(this.x, this.y);
      rotate(this.angle + random([-1, 1]) * 50 * 40 * this.plus / this.point_num);
      noFill();
      stroke(str(this.color) + "80");
      drawingContext.shadowColor = str(random(colors_dark)) + "80";
      drawingContext.shadowOffsetX = 0.45;
      drawingContext.shadowOffsetY = 0.45;
      drawingContext.shadowBlur = 0;
      strokeWeight(this.plus / 100);
      circle(0, 0, this.plus * 12);
      strokeWeight(random(0.55, 0.35) * random(1, 3) + 2.0 * this.plus / 50);
      beginShape();

      for (var x = -this.size; x < this.size; x += this.size / this.point_num) {
        var n = noise(x * 0.1, this.plus * 0.1, frameCount * 0.001);
        var y = map(n, 0, 1, -this.size * 0.25, this.size * 0.25); // if (x > this.size / this.point_num) {

        point(x, y); // }
      }

      endShape();
      pop();
    }
  }, {
    key: "update",
    value: function update() {
      this.plus += random(2, 1) * random(0.01, 0.005);

      if (frameCount % 10 == 0) {
        this.point_num += 5;
      }
    }
  }]);

  return conVerse_chat;
}(); // by SamuelYAN
// more works //
// https://twitter.com/SamuelAnn0924
// https://www.instagram.com/samuel_yan_1990/


function keyTyped() {
  if (key === "s" || key === "S") {
    saveCanvas("conVerse_GenArt_NFT", "png");
  }
}

function makeFilter() {
  var filterNum = int(Math.random() * 982);
  randomSeed(seed); // noiseのフィルターをつくる

  colorMode(HSB, 360, 100, 100, 100);
  drawingContext.shadowColor = color(0, 0, 5, 10);
  overAllTexture = createGraphics(width, height);
  overAllTexture.loadPixels();

  for (var i = 0; i < width; i += 1) {
    // noprotect
    for (var j = 0; j < height; j += 1) {
      if (filterNum % 4 == 0) {
        overAllTexture.set(i, j, color(random(60), 5, 95, noise(i / 3, j / 3, i * j / 50) * 12)); // white
      } else if (filterNum % 4 == 1) {
        overAllTexture.set(i, j, color(48, 25, 98, noise(i / 3, j / 3, i * j / 50) * 12)); // yellow
      } else if (filterNum % 4 == 2) {
        overAllTexture.set(i, j, color(random(5, 8), 25, 98, noise(i / 3, j / 3, i * j / 50) * 12));
      } else if (filterNum % 4 == 3) {
        overAllTexture.set(i, j, color(random(200, 210), 10, 86, noise(i / 3, j / 3, i * j / 50) * 12));
      }
    }
  }

  overAllTexture.updatePixels();
}

function drawOverPattern() {
  push();
  translate(width / 2, height / 2); //rotate(-PI / 2);

  var s = max(width, height) / 1 * sqrt(3) - 2;
  var n = 6;

  for (var theta = TWO_PI / 6; theta < TWO_PI; theta += TWO_PI / 6) {
    // noprotect
    divideOP(0, 0, s * cos(theta), s * sin(theta), s * cos(theta + TWO_PI / 6), s * sin(theta + TWO_PI / 6), n);
  }

  pop();
}

function prop(x1, y1, x2, y2, k) {
  var x3 = (1 - k) * x1 + k * x2;
  var y3 = (1 - k) * y1 + k * y2;
  return [x3, y3];
}

function divideOP(x1, y1, x2, y2, x3, y3, n) {
  if (n > 1) {
    var _prop = prop(x1, y1, x2, y2, 1 / 3),
        _prop2 = _slicedToArray(_prop, 2),
        xA = _prop2[0],
        yA = _prop2[1];

    var _prop3 = prop(x1, y1, x2, y2, 2 / 3),
        _prop4 = _slicedToArray(_prop3, 2),
        xB = _prop4[0],
        yB = _prop4[1];

    var _prop5 = prop(x2, y2, x3, y3, 1 / 3),
        _prop6 = _slicedToArray(_prop5, 2),
        xC = _prop6[0],
        yC = _prop6[1];

    var _prop7 = prop(x2, y2, x3, y3, 2 / 3),
        _prop8 = _slicedToArray(_prop7, 2),
        xD = _prop8[0],
        yD = _prop8[1];

    var _prop9 = prop(x3, y3, x1, y1, 1 / 3),
        _prop10 = _slicedToArray(_prop9, 2),
        xE = _prop10[0],
        yE = _prop10[1];

    var _prop11 = prop(x3, y3, x1, y1, 2 / 3),
        _prop12 = _slicedToArray(_prop11, 2),
        xF = _prop12[0],
        yF = _prop12[1];

    var _prop13 = prop(xF, yF, xC, yC, 1 / 2),
        _prop14 = _slicedToArray(_prop13, 2),
        xG = _prop14[0],
        yG = _prop14[1];

    divideOP(x1, y1, xA, yA, xF, yF, n - 1);
    divideOP(xA, yA, xB, yB, xG, yG, n - 1);
    divideOP(xB, yB, x2, y2, xC, yC, n - 1);
    divideOP(xG, yG, xF, yF, xA, yA, n - 1);
    divideOP(xC, yC, xG, yG, xB, yB, n - 1);
    divideOP(xF, yF, xG, yG, xE, yE, n - 1);
    divideOP(xG, yG, xC, yC, xD, yD, n - 1);
    divideOP(xD, yD, xE, yE, xG, yG, n - 1);
    divideOP(xE, yE, xD, yD, x3, y3, n - 1);
  } else {
    makeTriangle([x1, y1], [x2, y2], [x3, y3]);
  }
}

function makeTriangle(v1, v2, v3) {
  var points = shuffle([v1, v2, v3]);

  var _points$ = _slicedToArray(points[0], 2),
      x1 = _points$[0],
      y1 = _points$[1];

  var _points$2 = _slicedToArray(points[1], 2),
      x2 = _points$2[0],
      y2 = _points$2[1];

  var _points$3 = _slicedToArray(points[2], 2),
      x3 = _points$3[0],
      y3 = _points$3[1];

  var iStep = 1 / pow(2, floor(random(4, 2)));

  for (var i = 0; i < 1; i += iStep) {
    // noprotect
    var _prop15 = prop(x1, y1, x2, y2, 1 - i),
        _prop16 = _slicedToArray(_prop15, 2),
        x4 = _prop16[0],
        y4 = _prop16[1];

    var _prop17 = prop(x1, y1, x3, y3, 1 - i),
        _prop18 = _slicedToArray(_prop17, 2),
        x5 = _prop18[0],
        y5 = _prop18[1];

    triangle(x1, y1, x4, y4, x5, y5);
  }
}