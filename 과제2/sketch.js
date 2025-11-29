// ===== Palette =====
const SKIN = '#f8e3d6';         // brighter skin
const SKIN_SHADOW = '#efcdbb';
const BLUSH = '#f4a6c1';        // pink cheeks
const HAIR = '#242120';         // dark hair
const HAIR_SHINE = 'rgba(255,255,255,0.22)';
const EYE_PUPIL = '#101010';    // black smile eyes
const LIP = '#c96a73';
const SHIRT = '#5b8a72';
const BG = '#f7f7fb';

function setup() {
  createCanvas(600, 400);
  pixelDensity(2);
  noLoop();
}

function draw() {
  background(BG);

  const cx = 300;
  const cy = 210;
  const faceW = 220;
  const faceH = 260;

  // ===== Shoulders / Shirt =====
  noStroke();
  fill(SHIRT);
  rect(cx - 160, cy + faceH / 2 + 20, 320, 90, 20);

  // ===== Back Hair (long, chest-below) — draw BEFORE face =====
  drawBackHair(cx, cy, faceW, faceH);

  // ===== Face =====
  fill(SKIN);
  ellipse(cx, cy, faceW, faceH);

  // Ears
  fill(SKIN);
  ellipse(cx - faceW / 2 + 12, cy + 18, 28, 40);
  ellipse(cx + faceW / 2 - 12, cy + 18, 28, 40);

  // Soft cheek shadow
  fill(SKIN_SHADOW);
  ellipse(cx - 58, cy + 38, 38, 24);
  ellipse(cx + 58, cy + 38, 38, 24);

  // Pink blush
  fill(BLUSH);
  ellipse(cx - 58, cy + 40, 28, 18);
  ellipse(cx + 58, cy + 40, 28, 18);

  // ===== Top Hair (no bangs, no part) — draw AFTER face =====
  drawTopHairNoPart(cx , cy -30, faceW, faceH);

  // ===== Brows =====
  fill(HAIR);

  push();
  translate(cx - 60, cy - 48);
  rotate(radians(-6));
  rect(-26, -6, 52, 8, 4);
  pop();

  push();
  translate(cx + 60, cy - 48);
  rotate(radians(6));
  rect(-26, -6, 52, 8, 4);
  pop();

  // ===== Eyes: smiling arcs (no sclera) =====
  noFill();
  stroke(EYE_PUPIL);
  strokeCap(ROUND);
  strokeWeight(6);
  arc(cx - 46, cy - 10, 52, 26, PI + 0.12, TWO_PI - 0.12);
  arc(cx + 46, cy - 10, 52, 26, PI + 0.12, TWO_PI - 0.12);

  // subtle crease
  strokeWeight(1.2);
  arc(cx - 46, cy - 20, 54, 18, PI, TWO_PI);
  arc(cx + 46, cy - 20, 54, 18, PI, TWO_PI);

  noStroke();

  // ===== Nose =====
  stroke('#6a5e57');
  strokeWeight(2);
  line(cx, cy - 6, cx - 6, cy + 26);
  noFill();
  arc(cx - 2, cy + 28, 26, 14, 0, PI);
  noStroke();

  // ===== Mouth =====
  fill(LIP);
  arc(cx, cy + 64, 76, 36, 0, PI, CHORD);
  fill(0, 40);
  arc(cx, cy + 64, 70, 16, 0, PI, OPEN);

  // ===== Neck =====
  fill(SKIN);
  rect(cx - 34, cy + faceH / 2 - 34, 68, 66, 16);

  // ===== Small earrings (optional) =====
  fill('#d8b4fe');
  ellipse(cx + faceW / 2 - 12, cy + 30, 10, 12);
  ellipse(cx - faceW / 2 + 12, cy + 30, 10, 12);

  // Outline for sketch vibe
  noFill();
  stroke(0, 20);
  strokeWeight(2);
  ellipse(cx, cy, faceW, faceH);
}

// ---------- Hair helpers ----------
function drawBackHair(cx, cy, faceW, faceH) {
  fill(HAIR);
  noStroke();
  beginShape();
  vertex(cx - 150, cy - 12);
  bezierVertex(cx - 200, cy + 180, cx - 140, cy + 330, cx - 60, cy + 338);
  bezierVertex(cx + 60, cy + 342, cx + 160, cy + 280, cx + 160, cy - 12);
  // crown volume high
  bezierVertex(cx + 60, cy - 210, cx - 60, cy - 210, cx - 150, cy - 12);
  endShape(CLOSE);
}

function drawTopHairNoPart(cx, cy, faceW, faceH) {
  fill(HAIR);
  noStroke();
  beginShape();
  // Left hairline → crown → right hairline
  vertex(cx - 112, cy - 8);
  bezierVertex(cx - 125, cy - 40, cx - 92, cy - 78, cx - 50, cy - 98);
  bezierVertex(cx, cy - 122, cx + 52, cy - 98, cx + 92, cy - 72);
  bezierVertex(cx + 125, cy - 46, cx + 115, cy - 10, cx + 104, cy - 8);
  // Close above the forehead so it never covers eyes
  bezierVertex(cx + 44, cy - 18, cx - 44, cy - 18, cx - 112, cy - 8);
  endShape(CLOSE);

  // Shine
  noFill();
  stroke(HAIR_SHINE);
  strokeWeight(3);
  arc(cx - 60, cy - 102, 128, 78, PI + QUARTER_PI, TWO_PI - QUARTER_PI);
  noStroke();
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('caricature_nopart_smileyeyes', 'png');
  }
}
