// p5.js Caricature — interactive + 10s GIF 버튼 저장 버전
// Keys: [S] save PNG, [H] hair shine, [E] earrings,
//       [B] blush, [C] shirt color, [←/→] glance, [X] blink,
//       [R] random reaction, [D] demo (~10s)
// Mouse: move = head tilt & glance; click L/R = wink; press&hold = blush 강화
// ⚠️ 주의: saveGif()를 쓰려면 p5.gif 라이브러리를 로드해야 합니다.

let SKIN        = '#f8e3d6';
let SKIN_SHADOW = '#efcdbb';
let BLUSH       = '#f4a6c1';
let HAIR        = '#242120';
let HAIR_SHINE  = 'rgba(255,255,255,0.22)';
let EYE_PUPIL   = '#101010';
let LIP         = '#c96a73';
let BG          = '#f7f7fb';

let showShine = true, showEarrings = true, blushOn = true;
let glance = 0, forcedBlinkFrames = 0, winkSide = 0, lastWinkFrame = -9999;
let demoMode = false, demoStartFrame = 0, interacted = false;

// 배열 금지 → 셔츠 색 인덱스만 보관
let shirtIndex = 0;
function getShirtColor(i){
  i = ((i%5)+5)%5;
  if(i===0) return '#5b8a72';
  if(i===1) return '#7e88f3';
  if(i===2) return '#df7861';
  if(i===3) return '#4c9f70';
  return '#b06ab3';
}

// ====== 캔버스 크기 ======
const CAN_W = 600, CAN_H = 400;

// ====== Save GIF 버튼 상태 ======
let isRecordingGif = false;
let recordStartFrame = 0;
const GIF_SECONDS = 10;

// 버튼 스타일/위치
const BTN_W = 150, BTN_H = 40;
let btnX = CAN_W - BTN_W - 16;   // 오른쪽 아래
let btnY = CAN_H - BTN_H - 16;

function setup(){
  createCanvas(CAN_W, CAN_H);
  pixelDensity(2);
  frameRate(60);
  textFont('sans-serif');
}

function draw(){
  background(BG);

  const t = frameCount/60.0;
  const cx = 300, cy = 210, faceW = 220, faceH = 260;

  // 데모 자동 시연 (~10s)
  if(demoMode){
    const dt = frameCount - demoStartFrame;
    if(dt < 60) glance = -1;
    else if(dt < 120) glance = 1;
    else if(dt < 180) glance = 0;
    else if(dt < 210) forcedBlinkFrames = 10;
    else if(dt < 270) showShine = (dt%20<10);
    else if(dt < 330) blushOn = (dt%24<12);
    else if(dt < 390) showEarrings = (dt%30<15);
    else if(dt < 450) shirtIndex = (floor(dt/30))%5;
    else demoMode = false;
  }

  // Head pose
  const headTilt = map(mouseX, 0, width, -0.09, 0.09);
  const headNod  = map(mouseY, 0, height, -0.02, 0.02);
  const breathe  = sin(t*2.2) * 2.0;
  const hairSway = sin(t*3.0) * 6.0;

  // Shoulders / Shirt
  noStroke();
  fill(getShirtColor(shirtIndex));
  rect(cx - 160, cy + faceH/2 + 20 + breathe, 320, 90, 20);

  // Back hair
  push(); translate(0, hairSway*0.2); drawBackHair(cx, cy, faceW, faceH); pop();

  // Neck
  fill(SKIN);
  rect(cx - 34, cy + faceH/2 - 34 + breathe*0.6, 68, 66, 16);

  // Face group
  push();
  translate(cx, cy + breathe*0.3);
  rotate(headTilt + headNod);

  // Face & ears
  noStroke(); fill(SKIN); ellipse(0, 0, faceW, faceH);
  fill(SKIN); ellipse(-faceW/2 + 12, 18, 28, 40); ellipse(faceW/2 - 12, 18, 28, 40);

  // Cheek/Blush
  fill(SKIN_SHADOW); ellipse(-58, 38, 38, 24); ellipse(58, 38, 38, 24);
  if(blushOn){
    const pressBoost = keyIsPressed ? 1.12 : 1.0;
    const mouseBoost = mouseIsPressed ? 1.25 : 1.0;
    fill(BLUSH);
    const pulse = (1 + 0.06*sin(t*4.0)) * pressBoost * mouseBoost;
    ellipse(-58, 40, 28*pulse, 18*pulse);
    ellipse( 58, 40, 28*pulse, 18*pulse);
  }

  // Hair top
  drawTopHairNoPart(0, -30, faceW, faceH, showShine);

  // Brows
  fill(HAIR);
  push(); translate(-60 + glance*2, -48); rotate(radians(-6 + glance*3)); rect(-26, -6, 52, 8, 4); pop();
  push(); translate( 60 + glance*2, -48); rotate(radians( 6 + glance*3)); rect(-26, -6, 52, 8, 4); pop();

  // Eyes
  const blink = getBlinkAmount();
  drawSmileyEye(-46, -10, 52, 26, blink);
  drawSmileyEye( 46, -10, 52, 26, blink);
  noFill(); stroke(EYE_PUPIL); strokeWeight(1.2);
  arc(-46, -20, 54, 18, PI, TWO_PI); arc(46, -20, 54, 18, PI, TWO_PI); noStroke();

  // Nose
  stroke('#6a5e57'); strokeWeight(2); line(0, -6, -6, 26); noFill(); arc(-2, 28, 26, 14, 0, PI); noStroke();

  // Mouth (clipped)
  const smileOpen = getSmileCycleAmount();
  drawMouthClipped(smileOpen, faceW, faceH-40);

  // Earrings
  if(showEarrings){ fill('#d8b4fe'); ellipse(faceW/2 - 12, 30, 10, 12); ellipse(-faceW/2 + 12, 30, 10, 12); }

  // Outline
  noFill(); stroke(0, 20); strokeWeight(2); ellipse(0, 0, faceW, faceH);
  pop();

  // Wink timeout
  if(frameCount - lastWinkFrame > 18){ winkSide = 0; }

  // 도움말
  if(frameCount < 7*60 && !interacted){ drawHelpOverlay(); }

  // === 저장 버튼 UI ===
  drawSaveGifButton();
}

// Blink
function getBlinkAmount(){
  let period = 220 + 40*sin(frameCount*0.013);
  let phase = frameCount % period, b = 0;
  if(phase < 10) b = phase/10;
  else if(phase < 20) b = 1 - (phase-10)/10;
  if(forcedBlinkFrames > 0){ forcedBlinkFrames--; return 1; }
  return b;
}

// Smile cycle (0..1 삼각파)
function getSmileCycleAmount(){
  const speedBoost = (mouseIsPressed || keyIsPressed) ? 1.25 : 1.0;
  const w = frameCount * 0.12 * speedBoost;
  const m = (w % 200) / 100.0; // 0..2
  return 1.0 - abs(m - 1.0);
}

// Mouth clipped to face ellipse
function drawMouthClipped(smileOpen, faceW, faceH){
  const y = 66;
  const cavW = 90;
  const cavH = lerp(10, 88, smileOpen);
  const lipW = 96;
  const lipH = cavH + 16;

  const ctx = drawingContext;
  ctx.save();
  ctx.beginPath();
  // Canvas 2D ellipse: (cx, cy, radiusX, radiusY, rotation, start, end)
  ctx.ellipse(0, 0, faceW/2, faceH/2, 0, 0, Math.PI*2);
  ctx.closePath();
  ctx.clip();

  // cavity
  noStroke(); fill(30, 24, 28);
  arc(0, y, cavW, cavH, 0, PI, CHORD);

  // teeth
  if(smileOpen > 0.25){
    fill(255);
    const th = max(8, cavH*0.28);
    rectMode(CENTER); rect(0, y - cavH*0.36+30, 58, th, 6); rectMode(CORNER);
  }

  // tongue
  if(smileOpen > 0.55){ fill(230, 95, 120); ellipse(0, y + cavH*0.18, 46, cavH*0.35); }

  // lips outline
  noFill(); stroke(LIP); strokeWeight(12); arc(0, y, lipW, lipH, 0, PI);
  stroke(255, 120); strokeWeight(2); arc(0, y-2, lipW-8, lipH-6, 0.15, PI-0.15);

  ctx.restore();
}

function drawSmileyEye(x, y, w, h, blinkAmt){
  let openH = lerp(h, 2, blinkAmt);
  noFill(); stroke(EYE_PUPIL); strokeCap(ROUND); strokeWeight(6);
  const g = glance * 2.5 + (winkSide && ((winkSide<0 && x<0)||(winkSide>0 && x>0)) ? 0 : 0);
  arc(x + g, y, w, openH, PI + 0.12, TWO_PI - 0.12);
}

// Hair
function drawBackHair(cx, cy, faceW, faceH){
  fill(HAIR); noStroke(); beginShape();
  vertex(cx - 150, cy - 12);
  bezierVertex(cx - 200, cy + 180, cx - 140, cy + 330, cx - 60, cy + 338);
  bezierVertex(cx + 60,  cy + 342, cx + 160, cy + 280, cx + 160, cy - 12);
  bezierVertex(cx + 60,  cy - 210, cx - 60,  cy - 210, cx - 150, cy - 12);
  endShape(CLOSE);
}
function drawTopHairNoPart(cx, cy, faceW, faceH, shine=true){
  fill(HAIR); noStroke(); beginShape();
  vertex(cx - 112, cy - 8);
  bezierVertex(cx - 125, cy - 40, cx - 92, cy - 78, cx - 50, cy - 98);
  bezierVertex(cx,       cy - 122, cx + 52, cy - 98,  cx + 92, cy - 72);
  bezierVertex(cx + 125, cy - 46,  cx + 115, cy - 10, cx + 104, cy - 8);
  bezierVertex(cx + 44,  cy - 18,  cx - 44,  cy - 18,  cx - 112, cy - 8);
  endShape(CLOSE);
  if(shine){ noFill(); stroke(HAIR_SHINE); strokeWeight(3); arc(cx - 60, cy - 102, 128, 78, PI + QUARTER_PI, TWO_PI - QUARTER_PI); noStroke(); }
}

// UI
function drawHelpOverlay(){
  push(); noStroke(); fill(255, 230); rect(16, 16, 356, 126, 12);
  fill(20); textSize(14); textStyle(BOLD); text('Controls', 28, 40); textStyle(NORMAL);
  text('- Mouse move: head tilt & glance', 28, 64);
  text('- Mouse press: blush 강화, click L/R: wink', 28, 84);
  text('- Keys: [S] save PNG, [H] hair, [E] earrings, [B] blush', 28, 104);
  text('       [C] shirt, [←/→] glance, [X] blink, [R] 랜덤, [D] demo', 28, 124);
  pop();
}

function drawSaveGifButton(){
  // 그림자
  noStroke();
  fill(0, 40);
  rect(btnX+2, btnY+3, BTN_W, BTN_H, 10);
  // 배경
  fill(isRecordingGif ? '#444' : '#222');
  rect(btnX, btnY, BTN_W, BTN_H, 10);

  // 진행바
  if(isRecordingGif){
    const elapsed = (frameCount - recordStartFrame) / (60 * GIF_SECONDS); // 60fps 기준
    fill('#77d7a4');
    rect(btnX, btnY + BTN_H - 6, constrain(elapsed, 0, 1) * BTN_W, 6, 10);
  }

  // 텍스트
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(isRecordingGif ? 'Saving GIF…' : 'Save GIF (10s)', btnX + BTN_W/2, btnY + BTN_H/2);

  // 라이브러리 로드 체크 알림
  if(typeof saveGif !== 'function'){
    push();
    fill(255, 220, 220);
    rect(16, height-56, 300, 40, 8);
    fill(180, 20, 20);
    textSize(12);
    textAlign(LEFT, CENTER);
    text('p5.gif 라이브러리가 필요해요 → saveGif 사용 불가', 26, height-36);
    pop();
  }
}

// Interaction (중복 정의 없이 하나씩만!)
function keyPressed(){
  interacted = true;
  if(key === 's' || key === 'S'){ // PNG 저장
    saveCanvas('caricature_interactive', 'png');
  }else if(key === 'h' || key === 'H'){ showShine = !showShine; }
  else if(key === 'e' || key === 'E'){ showEarrings = !showEarrings; }
  else if(key === 'b' || key === 'B'){ blushOn = !blushOn; }
  else if(key === 'c' || key === 'C'){ shirtIndex = (shirtIndex + 1) % 5; }
  else if(keyCode === LEFT_ARROW){ glance = -1; }
  else if(keyCode === RIGHT_ARROW){ glance = 1; }
  else if(key === 'x' || key === 'X'){ forcedBlinkFrames = 10; }
  else if(key === 'd' || key === 'D'){ demoMode = true; demoStartFrame = frameCount; }
  else if(key === 'r' || key === 'R'){
    BG = color(random(230,255), random(230,255), random(235,255));
    shirtIndex = floor(random(0,5));
    forcedBlinkFrames = 8;
  }
}
function keyReleased(){ if(keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW){ glance = 0; } }
function mouseMoved(){ interacted = true; }
function mousePressed(){
  interacted = true;

  // 버튼 클릭 먼저 처리
  if(mouseX>btnX && mouseX<btnX+BTN_W && mouseY>btnY && mouseY<btnY+BTN_H){
    startGifRecording();
    return; // 버튼 클릭이면 다른 클릭 로직 생략
  }

  // 일반 클릭 → 윙크
  winkSide = (mouseX < width/2) ? -1 : 1;
  lastWinkFrame = frameCount;
}

// ====== GIF 저장 로직 ======
function startGifRecording(){
  if(typeof saveGif !== 'function'){
    console.warn('p5.gif.js가 로드되지 않았습니다.');
    return;
  }
  if(isRecordingGif) return; // 중복 시작 방지

  isRecordingGif = true;
  recordStartFrame = frameCount;

  // 10초 GIF 저장
  saveGif('mySketch_10s', GIF_SECONDS, {
    units: 'seconds',
    delay: 0,
    repeat: 0,          // 0: 무한 반복
    quality: 10,        // 1(최고)~20(보통) — 숫자 작을수록 화질↑(용량↑)
    dither: 'FloydSteinberg'
  });

  // 진행바 표시용 플래그 종료(대략적인 여유)
  setTimeout(()=>{ isRecordingGif = false; }, (GIF_SECONDS+2)*1000);
}
