let skyTop1, skyTop2;
let faceCol1, faceCol2;
let windowCol;
let lastWindowChange = 0;

let saveBtn

function setup() {
  createCanvas(600, 400); 
  frameRate(30);          
  colorMode(RGB, 255);    

  // 하늘 그라데이션용 색
  skyTop1 = color(230, 245, 255); 
  skyTop2 = color(60, 90, 150);   

  // 스마일 얼굴 색 변화용
  faceCol1 = color(255, 160, 60);
  faceCol2 = color(255, 200, 120);

  windowCol = color(random(200, 255), random(200, 255), random(120, 200));

  saveBtn = createButton('Save GIF (10s)');
  saveBtn.position(20, 20);
  saveBtn.style('padding', '6px 12px');
  saveBtn.style('font-size', '14px');
  saveBtn.style('border-radius', '6px');
  saveBtn.style('border', '1px solid #333');
  saveBtn.style('background', '#ffffff');
  saveBtn.style('cursor', 'pointer');
  saveBtn.mousePressed(() => {
  saveGif(name, durationInSeconds);
    saveGif('myAnimation', 10);
  });
}

function draw() {
  const t = millis() / 1000.0; // 시간(초) 단위
  const dayPhase = (sin(t * 0.25) + 1) / 2; // 0~1 사이 반복 (하늘 색 변화용)

  // ==== 배경 (하늘 그라데이션 + lerpColor) ====
  let topCol = lerpColor(skyTop1, skyTop2, dayPhase);
  let bottomCol = color(235); // 원래 배경색 유지
  for (let y = 0; y < height; y++) {
    let amt = y / height;
    let rowCol = lerpColor(topCol, bottomCol, amt);
    stroke(rowCol);
    line(0, y, width, y);
  }

  let bob = sin(frameCount * 0.08) * 6;        // 위아래 움직임
  let wobbleX = sin(frameCount * 0.03) * 4;    // 좌우 살짝
  const baseScx = 100, baseScy = 80;
  const scx = baseScx + wobbleX;
  const scy = baseScy + bob;

  const baseDiam = 120;
  const sdiam = baseDiam + sin(frameCount * 0.05) * 8; // 크기 변화
  const sr = sdiam / 2;

  // 얼굴 색 lerpColor 로 부드럽게 변화
  let faceMix = (sin(frameCount * 0.03) + 1) / 2;
  let faceCol = lerpColor(faceCol1, faceCol2, faceMix);

  // 얼굴
  noStroke();
  fill(faceCol);
  circle(scx, scy, sdiam);

  // 눈
  fill(0);
  circle(scx - 18, scy - 8, 10);
  circle(scx + 18, scy - 8, 10);

  // 입
  noFill();
  stroke(0);
  strokeWeight(4);
  arc(scx, scy + 6, 70, 44, radians(20), radians(160));

  // 도트 링 (회전 + HSB 색 변화)
  const ringR = sr + 14;
  let angleOffset = frameCount * 2; // 회전 속도
  colorMode(HSB, 360, 100, 100);
  noStroke();
  for (let a = 0; a < 360; a += 18) {
    let rad = radians(a + angleOffset);
    let px = scx + cos(rad) * ringR;
    let py = scy + sin(rad) * ringR;
    let h = (a + frameCount * 3) % 360; // 무지개 색
    let dotCol = color(h, 80, 100);
    fill(dotCol);
    circle(px, py, (a % 36 === 0) ? 5 : 3.5);
  }
  colorMode(RGB, 255); // 다시 RGB 로 되돌리기

  // ==== 구름 (연하늘~파랑 계열, 구름 이동 애니메이션) ====
  const sky1 = color(230, 245, 255);
  const sky2 = color(200, 230, 255);
  const sky3 = color(150, 200, 255);
  const sky4 = color(120, 170, 245);

  // 구름이 오른쪽으로 천천히 이동 후 반복
  let cloudShift = (frameCount * 0.4) % (width + 200);

  drawCloud(300 + cloudShift - 100, 70, 120, sky1, sky2, sky3, sky4);  // 상단 중앙
  drawCloud(480 + cloudShift - 200, 85, 140, sky1, sky2, sky3, sky4);  // 우상단
  drawCloud(380 + cloudShift - 150, 130, 100, sky1, sky2, sky3, sky4); // 중앙 우측

  // ==== 바닥 잔디 ====
  noStroke();
  fill(90, 170, 90);
  rect(0, 360, width, 40);

  // ==== 집 (가운데 아래, 크게) ====
  const houseW = 160, houseH = 110;
  const houseX = width / 2 - houseW / 2;
  const houseY = 360 - houseH;

  // 본체
  fill(235, 210, 170);
  rect(houseX, houseY, houseW, houseH);

  // 지붕
  fill(210, 110, 80);
  triangle(
    houseX - 15, houseY,
    houseX + houseW / 2, houseY - 50,
    houseX + houseW + 15, houseY
  );

  // 문
  fill(130, 90, 60);
  rect(houseX + 32, houseY + 36, 28, 74);
  fill(255, 230, 150);
  circle(houseX + 50, houseY + 72, 4);

  // 창문 (랜덤 색으로 몇 초마다 변경: random 사용)
  if (millis() - lastWindowChange > 900) {
    // 약 0.9초마다 전등이 바뀌는 느낌
    windowCol = color(random(200, 255), random(200, 255), random(150, 255));
    lastWindowChange = millis();
  }

  fill(windowCol);
  rect(houseX + 96, houseY + 26, 54, 36, 6);
  stroke(160, 180, 200);
  strokeWeight(3);
  line(houseX + 123, houseY + 26, houseX + 123, houseY + 62);
  line(houseX + 96,  houseY + 44, houseX + 150, houseY + 44);
  let windPhase = frameCount * 0.04;

  drawTree(70,  250, 0.9,  windPhase + 0.0);
  drawTree(130, 260, 0.8,  windPhase + 0.5);
  drawTree(500, 250, 0.95, windPhase + 1.0);
  drawTree(560, 262, 0.8,  windPhase + 1.5);

  noFill();
  stroke(0);
  strokeWeight(6);
  rect(20, 20, width - 40, height - 40);
}
function drawCloud(cx, cy, w, sky1, sky2, sky3, sky4) {
  noStroke();
  // 바닥(수평) 원들
  fill(sky3);
  circle(cx - w * 0.27, cy, w * 0.40);
  fill(sky2);
  circle(cx,               cy - 4, w * 0.48);
  fill(sky3);
  circle(cx + w * 0.28,    cy,     w * 0.40);
  // 윗부분 볼륨
  fill(sky1);
  circle(cx - w * 0.10, cy - w * 0.18, w * 0.36);
  fill(sky2);
  circle(cx + w * 0.20, cy - w * 0.15, w * 0.30);
  // 약한 음영
  fill(red(sky4), green(sky4), blue(sky4), 90);
  circle(cx + w * 0.05, cy - w * 0.06, w * 0.18);
}

function drawTree(baseX, trunkY, s, phase) {
  // 바람에 흔들리는 느낌을 위해 약간 기울기 + 윗부분 offset
  let sway = sin(phase) * 6 * s;

  push();
  translate(baseX + 13 * s, trunkY + 95 * s); // 나무 밑부분 기준점
  rotate(radians(sway * 0.3));
  translate(- (baseX + 13 * s), - (trunkY + 95 * s));

  const trunkW = 26 * s, trunkH = 95 * s;
  fill(120, 80, 40);
  rect(baseX, trunkY, trunkW, trunkH);

  const cx = baseX + trunkW / 2 + sway * 0.3; // 윗부분 살짝 이동

  // 잎 부분
  fill(60, 150, 80);
  circle(cx,            trunkY - 8 * s, 90 * s);
  fill(80, 175, 95);
  circle(cx - 24 * s,   trunkY + 10 * s, 74 * s);
  fill(80, 175, 95);
  circle(cx + 24 * s,   trunkY + 10 * s, 74 * s);
  fill(110, 200, 110);
  circle(cx,            trunkY + 22 * s, 64 * s);

  // 열매 (크기 변화 애니메이션)
  let fruitPulse = 1 + 0.25 * sin(frameCount * 0.1 + phase * 2);
  fill(220, 60, 60);
  circle(cx - 8 * s, trunkY + 26 * s, 8 * s * fruitPulse);
  circle(cx + 14 * s, trunkY - 4 * s, 6 * s * fruitPulse);

  pop();
}

// ==== GIF 저장용 (키보드로도 가능) ====
// G 키를 누르면 10초짜리 animated GIF 생성
function keyPressed() {
  if (key === 'g' || key === 'G') {
    saveGif(‘이채린_과제4', 10);
  }
}