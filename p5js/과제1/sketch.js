let skyTop1, skyTop2;
let faceCol1, faceCol2;
let windowCol;
let saveBtn;

function setup() {
  createCanvas(600, 400);   // 요청한 사이즈
  colorMode(RGB, 255);

  // 하늘 그라데이션 색
  skyTop1 = color(230, 245, 255);
  skyTop2 = color(60, 90, 150);

  // 스마일 얼굴 색 (두 색 중간 정도로 고정)
  faceCol1 = color(255, 160, 60);
  faceCol2 = color(255, 200, 120);

  // 창문 색 (고정)
  windowCol = color(190, 225, 255);

  // 캔버스 저장 버튼
  saveBtn = createButton('이미지 저장');
  saveBtn.position(10, 10);
  saveBtn.mousePressed(() => saveCanvas('my_scene', 'png'));

  noLoop();  // 한 번만 그리기 → 애니메이션 없음
}

function draw() {
  // 하늘 그라데이션
  drawSkyGradient();

  // 잔디
  noStroke();
  fill(70, 180, 90);
  rect(0, height * 0.7, width, height * 0.3);

  // 얼굴 색을 두 색의 중간값으로 고정
  let currentFaceCol = lerpColor(faceCol1, faceCol2, 0.4);

  // 태양
  drawSun(90, 80, 40, currentFaceCol);

  // 구름들
  drawCloud(260, 90, 0.9);
  drawCloud(430, 70, 1.1);
  drawCloud(360, 140, 0.8);

  // 집
  drawHouse(width / 2, height * 0.7, 220, 150);

  // 나무들
  drawTree(130, height * 0.7, 0.9);
  drawTree(190, height * 0.72, 0.8);
  drawTree(410, height * 0.7, 0.9);
  drawTree(470, height * 0.72, 0.8);

  // 바깥 테두리
  noFill();
  stroke(0);
  strokeWeight(8);
  rect(4, 4, width - 8, height - 8);
}

// ====== helper functions ======

function drawSkyGradient() {
  for (let y = 0; y < height * 0.7; y++) {
    let amt = y / (height * 0.7);
    let col = lerpColor(skyTop1, skyTop2, amt);
    stroke(col);
    line(0, y, width, y);
  }
}

function drawSun(cx, cy, r, faceCol) {
  // 주변 점
  fill(120);
  noStroke();
  let dotsR = r + 25;
  for (let a = 0; a < TWO_PI; a += TWO_PI / 16) {
    let x = cx + cos(a) * dotsR;
    let y = cy + sin(a) * dotsR;
    circle(x, y, 6);
  }

  // 본체
  fill(faceCol);
  circle(cx, cy, r * 2);

  // 눈
  fill(0);
  circle(cx - r * 0.5, cy - r * 0.2, 8);
  circle(cx + r * 0.5, cy - r * 0.2, 8);

  // 입
  noFill();
  stroke(0);
  strokeWeight(3);
  arc(cx, cy + 4, r * 1.1, r * 0.8, 0.1 * PI, 0.9 * PI);
}

function drawCloud(cx, cy, s) {
  noStroke();
  let mainR = 28 * s;

  fill(170, 205, 255);
  circle(cx - mainR, cy, mainR * 2);
  circle(cx + mainR, cy, mainR * 2);

  fill(205, 225, 255);
  circle(cx, cy - mainR * 0.7, mainR * 2.1);

  fill(220, 240, 255);
  circle(cx - mainR * 0.6, cy - mainR * 0.9, mainR * 1.7);
  circle(cx + mainR * 0.6, cy - mainR * 0.9, mainR * 1.7);

  fill(135, 170, 255);
  circle(cx, cy - mainR * 0.2, mainR * 1.3);
}

function drawHouse(cx, bottomY, w, h) {
  let x = cx - w / 2;
  let y = bottomY - h;

  // 집 몸통
  noStroke();
  fill(235, 210, 160);
  rect(x, y, w, h);

  // 지붕
  fill(205, 110, 70);
  triangle(
    cx - w / 2 - 5, y,
    cx + w / 2 + 5, y,
    cx, y - h * 0.45
  );

  // 문
  fill(120, 80, 50);
  let doorW = w * 0.16;
  let doorH = h * 0.55;
  let doorX = x + w * 0.26;
  let doorY = y + h - doorH;
  rect(doorX, doorY, doorW, doorH);

  // 문 손잡이
  fill(240, 210, 120);
  circle(doorX + doorW * 0.75, doorY + doorH * 0.5, 6);

  // 창문 (고정 색)
  let winW = w * 0.26;
  let winH = h * 0.28;
  let winX = x + w * 0.60;
  let winY = y + h * 0.30;

  stroke(170, 200, 220);
  strokeWeight(3);
  fill(windowCol);
  rect(winX, winY, winW, winH, 10);

  // 창틀 선
  line(winX, winY + winH / 2, winX + winW, winY + winH / 2);
  line(winX + winW / 2, winY, winX + winW / 2, winY + winH);
}

function drawTree(cx, bottomY, s) {
  // 줄기
  let trunkW = 25 * s;
  let trunkH = 80 * s;
  let trunkX = cx - trunkW / 2;
  let trunkY = bottomY - trunkH;

  stroke(170, 190, 205);
  strokeWeight(5);
  fill(130, 90, 55);
  rect(trunkX, trunkY, trunkW, trunkH);

  // 잎
  let rBig = 45 * s;
  let rSmall = 37 * s;

  fill(60, 150, 80);
  circle(cx - rBig * 0.7, trunkY - rBig * 0.3, rBig * 2);
  circle(cx + rBig * 0.7, trunkY - rBig * 0.3, rBig * 2);
  circle(cx, trunkY - rBig * 0.9, rBig * 2);

  fill(120, 210, 90);
  circle(cx - rBig * 0.7, trunkY - rBig * 0.3, rSmall * 2);
  circle(cx + rBig * 0.7, trunkY - rBig * 0.3, rSmall * 2);
  circle(cx, trunkY - rBig * 0.9, rSmall * 2);

  // 열매
  noStroke();
  fill(240, 120, 150);
  circle(cx - rBig * 0.7 + 6 * s, trunkY - rBig * 0.3 + 4 * s, 7 * s);
  circle(cx + rBig * 0.7 - 5 * s, trunkY - rBig * 0.3 + 2 * s, 7 * s);
  circle(cx + 3 * s, trunkY - rBig * 0.9 - 3 * s, 7 * s);
}
