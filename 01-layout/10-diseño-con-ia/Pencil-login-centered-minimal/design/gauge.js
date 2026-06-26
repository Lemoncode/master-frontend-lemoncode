/**
 * @schema 2.10
 * @input speed: number(min=0, max=320) = 210
 * @input maxSpeed: number = 320
 * @input stepMajor: number = 40
 * @input faceColor: color = #F5F5F5
 * @input bezelColor: color = #E5E5E5
 * @input needleColor: color = #FF7A00
 * @input tickColor: color = #333333
 * @input numberColor: color = #1A1A1A
 * @input digitalColor: color = #1A1A1A
 * @input numberFont: string = "JetBrains Mono"
 * @input bezel: ref
 * @input face: ref
 * @input majorTick: ref
 * @input minorTick: ref
 * @input needle: ref
 * @input fuelLevel: number(min=0, max=1) = 0.7
 */

const w = pencil.width;
const h = pencil.height;
const cx = w / 2;
const cy = h / 2;
const outerR = Math.min(cx, cy) * 0.95;
const faceR = outerR * 0.92;

const startDeg = 225;
const sweepDeg = 270;
const maxSpeed = pencil.input.maxSpeed;
const speed = Math.min(pencil.input.speed, maxSpeed);
const stepMajor = pencil.input.stepMajor;

const bezelRef = pencil.input.bezel;
const faceRef = pencil.input.face;
const majorTickRef = pencil.input.majorTick;
const minorTickRef = pencil.input.minorTick;
const needleRef = pencil.input.needle;

const nodes = [];

function deg2rad(d) {
  return (d * Math.PI) / 180;
}

function f(n) {
  return n.toFixed(2);
}

function speedToAngle(v) {
  return deg2rad(startDeg - (v / maxSpeed) * sweepDeg);
}

function posAt(angle, r) {
  return { x: cx + Math.cos(angle) * r, y: cy - Math.sin(angle) * r };
}

// Rotation in .pen is CCW around the component's top-left corner in y-down
// coords. To place a component so that a local pivot (px, py) lands at world
// (wx, wy) after rotating rotDeg degrees, we un-rotate the pivot and subtract.
function placedAt(wx, wy, rotDeg, pivotX, pivotY) {
  const r = deg2rad(rotDeg);
  const cosR = Math.cos(r);
  const sinR = Math.sin(r);
  const rpx = pivotX * cosR + pivotY * sinR;
  const rpy = -pivotX * sinR + pivotY * cosR;
  return { x: wx - rpx, y: wy - rpy };
}

function pushTickLine(p1, p2, thickness, color) {
  const lx = Math.min(p1.x, p2.x);
  const ly = Math.min(p1.y, p2.y);
  const lw = Math.max(Math.abs(p2.x - p1.x), 0.1);
  const lh = Math.max(Math.abs(p2.y - p1.y), 0.1);

  nodes.push({
    type: "path",
    x: lx,
    y: ly,
    width: lw,
    height: lh,
    viewBox: [0, 0, lw, lh],
    geometry:
      "M " + f(p1.x - lx) + " " + f(p1.y - ly) +
      " L " + f(p2.x - lx) + " " + f(p2.y - ly),
    stroke: {
      align: "center",
      thickness: thickness,
      cap: "round",
      fill: color,
    },
  });
}

if (bezelRef) {
  nodes.push({
    type: "ref",
    ref: bezelRef,
    x: cx - outerR,
    y: cy - outerR,
    width: outerR * 2,
    height: outerR * 2,
  });
} else {
  nodes.push({
    type: "ellipse",
    x: cx - outerR,
    y: cy - outerR,
    width: outerR * 2,
    height: outerR * 2,
    fill: [
      {
        type: "gradient",
        gradientType: "linear",
        rotation: 180,
        colors: [
          { color: "#E8E8E8FF", position: 0 },
          { color: "#F0F0F0FF", position: 0.4 },
          { color: "#F5F5F5FF", position: 1 },
        ],
      },
    ],
    stroke: { align: "outside", thickness: 3, fill: "#D0D0D0FF" },
    effect: {
      type: "shadow",
      shadowType: "outer",
      color: "#00000022",
      offset: { x: 0, y: 6 },
      blur: 20,
    },
  });

  nodes.push({
    type: "ellipse",
    x: cx - outerR * 0.96,
    y: cy - outerR * 0.96,
    width: outerR * 1.92,
    height: outerR * 1.92,
    stroke: { align: "inside", thickness: 1.5, fill: "#D5D5D5FF" },
  });
}

if (faceRef) {
  nodes.push({
    type: "ref",
    ref: faceRef,
    x: cx - faceR,
    y: cy - faceR,
    width: faceR * 2,
    height: faceR * 2,
  });
} else {
  nodes.push({
    type: "ellipse",
    x: cx - faceR,
    y: cy - faceR,
    width: faceR * 2,
    height: faceR * 2,
    fill: [{ type: "color", color: pencil.input.faceColor }],
  });
}

const totalMinor = (maxSpeed / stepMajor) * 8;
for (let i = 0; i <= totalMinor; i++) {
  const v = (i / totalMinor) * maxSpeed;
  const modMajor = v % stepMajor;
  const isMajor = modMajor < 0.01 || stepMajor - modMajor < 0.01;
  if (isMajor) {
    continue;
  }
  const modHalf = v % (stepMajor / 2);
  const isMid = modHalf < 0.01 || stepMajor / 2 - modHalf < 0.01;

  const angle = speedToAngle(v);
  const tickOuterR = faceR - 4;
  const tickLen = isMid ? 8 : 4;
  const tickThickness = isMid ? 1.2 : 0.8;
  const tickInnerR = tickOuterR - tickLen;

  if (minorTickRef) {
    const compW = 1;
    const p = posAt(angle, tickOuterR);
    const rotDeg = (angle * 180) / Math.PI - 90;
    const pos = placedAt(p.x, p.y, rotDeg, compW / 2, 0);
    nodes.push({
      type: "ref",
      ref: minorTickRef,
      x: pos.x,
      y: pos.y,
      height: tickLen,
      rotation: rotDeg,
    });
  } else {
    pushTickLine(
      posAt(angle, tickInnerR),
      posAt(angle, tickOuterR),
      tickThickness,
      "#71717A66"
    );
  }
}

for (let v = 0; v <= maxSpeed; v += stepMajor) {
  const angle = speedToAngle(v);
  const tickOuterR = faceR - 4;
  const tickInnerR = tickOuterR - 14;

  if (majorTickRef) {
    const compW = 3;
    const p = posAt(angle, tickOuterR);
    const rotDeg = (angle * 180) / Math.PI - 90;
    const pos = placedAt(p.x, p.y, rotDeg, compW / 2, 0);
    nodes.push({
      type: "ref",
      ref: majorTickRef,
      x: pos.x,
      y: pos.y,
      rotation: rotDeg,
    });
  } else {
    pushTickLine(
      posAt(angle, tickInnerR),
      posAt(angle, tickOuterR),
      2.5,
      pencil.input.tickColor
    );
  }
}

const numR = faceR - 50;
const fontSize = faceR * 0.09;
for (let v = 0; v <= maxSpeed; v += stepMajor) {
  const angle = speedToAngle(v);
  const p = posAt(angle, numR);

  nodes.push({
    type: "text",
    x: p.x - fontSize * 1.2,
    y: p.y - fontSize * 0.6,
    width: fontSize * 2.4,
    height: fontSize * 1.2,
    content: String(v),
    fontSize: fontSize,
    fontFamily: pencil.input.numberFont,
    fontWeight: "400",
    textAlign: "center",
    textAlignVertical: "middle",
    textGrowth: "fixed-width-height",
    fill: pencil.input.numberColor,
  });
}

const needleAngle = speedToAngle(speed);
const needleLen = faceR * 0.72;
const needleTail = faceR * 0.12;

if (needleRef) {
  const compW = 3;
  const compH = needleLen + needleTail;
  // The needle component's pivot point (where it crosses gauge center) is
  // (compW/2, needleLen) measured from the tip.
  const rotDeg = (needleAngle * 180) / Math.PI + 270;
  const pos = placedAt(cx, cy, rotDeg, compW / 2, needleLen);
  nodes.push({
    type: "ref",
    ref: needleRef,
    x: pos.x,
    y: pos.y,
    height: compH,
    rotation: rotDeg,
  });
} else {
  const tailP = posAt(needleAngle + Math.PI, needleTail);
  const tipP = posAt(needleAngle, needleLen);
  const nlx = Math.min(tailP.x, tipP.x);
  const nly = Math.min(tailP.y, tipP.y);
  const nlw = Math.max(Math.abs(tipP.x - tailP.x), 0.1);
  const nlh = Math.max(Math.abs(tipP.y - tailP.y), 0.1);

  nodes.push({
    type: "path",
    x: nlx,
    y: nly,
    width: nlw,
    height: nlh,
    viewBox: [0, 0, nlw, nlh],
    geometry:
      "M " + f(tailP.x - nlx) + " " + f(tailP.y - nly) +
      " L " + f(tipP.x - nlx) + " " + f(tipP.y - nly),
    stroke: {
      align: "center",
      thickness: 3,
      cap: "round",
      fill: pencil.input.needleColor,
    },
    effect: {
      type: "shadow",
      shadowType: "outer",
      color: pencil.input.needleColor + "66",
      offset: { x: 0, y: 0 },
      blur: 6,
    },
  });
}

const digitalFontSize = faceR * 0.24;
const unitFontSize = faceR * 0.08;
const speedBlockH = digitalFontSize * 1.1 + unitFontSize * 1.5 + 2;
const speedCircleR = faceR * 0.26;

nodes.push({
  type: "ellipse",
  x: cx - speedCircleR,
  y: cy - speedCircleR,
  width: speedCircleR * 2,
  height: speedCircleR * 2,
  fill: "#F0F0F0FF",
  stroke: { align: "center", thickness: 1, fill: "#00000010" },
});

nodes.push({
  type: "text",
  x: cx - digitalFontSize * 1.2,
  y: cy - speedBlockH * 0.4,
  width: digitalFontSize * 2.4,
  height: digitalFontSize * 1.1,
  content: String(Math.round(speed)),
  fontSize: digitalFontSize,
  fontFamily: pencil.input.numberFont,
  fontWeight: "400",
  textAlign: "center",
  textAlignVertical: "middle",
  textGrowth: "fixed-width-height",
  fill: pencil.input.digitalColor,
});

nodes.push({
  type: "text",
  x: cx - unitFontSize * 2,
  y: cy - speedBlockH * 0.5 + digitalFontSize * 1.1 + 2,
  width: unitFontSize * 4,
  height: unitFontSize * 1.5,
  content: "km/h",
  fontSize: unitFontSize,
  fontFamily: pencil.input.numberFont,
  fontWeight: "400",
  textAlign: "center",
  textAlignVertical: "middle",
  textGrowth: "fixed-width-height",
  fill: "#666666",
});

nodes.push({
  type: "ellipse",
  x: cx - faceR * 0.75,
  y: cy - faceR * 0.85,
  width: faceR * 1.5,
  height: faceR * 1.2,
  fill: [
    {
      type: "gradient",
      gradientType: "linear",
      rotation: 180,
      colors: [
        { color: "#00000008", position: 0 },
        { color: "#00000003", position: 0.5 },
        { color: "#00000000", position: 1 },
      ],
    },
  ],
});

return nodes;
