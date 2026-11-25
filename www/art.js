'use strict';
/* Lumvero Fit – eigene Grafiken: Linien-Icons (wie LumveroIcons.kt), Übungsfiguren (wie ExerciseArt.kt, als SVG),
   Diagramme (wie Charts.kt) und Rekord-Konfetti (wie Celebration.kt). Alles selbst gezeichnet, keine fremden Assets. */
(function (g) {
  const f2 = (n) => Math.round(n * 100) / 100;

  // ---------------- Icons (24er-Raster, 1,8er-Strich) ----------------
  const circ = (cx, cy, r) => `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`;
  const ICONS = {
    home: [['M4,10.5 L12,4 L20,10.5 V18.5 Q20,20 18.5,20 H15 V14.5 H9 V20 H5.5 Q4,20 4,18.5 Z']],
    dumbbell: [['M5.5,8 Q5.5,6.5 7,6.5 Q8.5,6.5 8.5,8 V16 Q8.5,17.5 7,17.5 Q5.5,17.5 5.5,16 Z', 'M15.5,8 Q15.5,6.5 17,6.5 Q18.5,6.5 18.5,8 V16 Q18.5,17.5 17,17.5 Q15.5,17.5 15.5,16 Z', 'M8.5,12 H15.5', 'M3,10 V14', 'M21,10 V14']],
    timer: [[circ(12, 13.5, 7), 'M12,13.5 L12,10', 'M10,3.5 H14', 'M18,7.2 L19.4,5.8']],
    body: [[circ(12, 5.5, 2.2), 'M6.5,10 Q12,11.5 17.5,10', 'M12,10.8 V15', 'M12,15 L9,20.5', 'M12,15 L15,20.5']],
    chart: [['M4,19.5 H20', 'M5,15 L9.5,10.5 L13,13.5 L19.5,6.5', 'M15.5,6.5 H19.5 V10.5']],
    tune: [['M4,7 H13', 'M19,7 H20', circ(16, 7, 2.5), 'M4,17 H6', 'M12,17 H20', circ(9, 17, 2.5)]],
    flame: [[], ['M12,2.8 C12,2.8 6.2,8.4 6.2,13.6 C6.2,17.3 8.8,20.3 12,20.3 C15.2,20.3 17.8,17.3 17.8,13.6 C17.8,10.6 16.1,8.5 15,7.5 C14.8,9.4 13.8,10.7 12.6,11.2 C13.1,8.4 12.8,5.2 12,2.8 Z']],
    drop: [[], ['M12,3.2 C12,3.2 5.8,9.8 5.8,14 C5.8,17.5 8.6,20.3 12,20.3 C15.4,20.3 18.2,17.5 18.2,14 C18.2,9.8 12,3.2 12,3.2 Z']],
    steps: [['M8,3.5 C9.8,3.5 10.6,5.6 10.6,8 C10.6,10.6 9.6,12.5 8,12.5 C6.4,12.5 5.4,10.6 5.4,8 C5.4,5.6 6.2,3.5 8,3.5 Z', circ(8, 16.2, 1.8), 'M16,8.5 C17.8,8.5 18.6,10.6 18.6,13 C18.6,15.6 17.6,17.5 16,17.5 C14.4,17.5 13.4,15.6 13.4,13 C13.4,10.6 14.2,8.5 16,8.5 Z', circ(16, 21, 1.2)]],
    trophy: [['M8,4 H16 V10 Q16,14 12,14 Q8,14 8,10 Z', 'M8,6 H5.5 Q5.5,10 8.4,11', 'M16,6 H18.5 Q18.5,10 15.6,11', 'M12,14 V17', 'M8.5,20 H15.5', 'M10,17 H14 L14.5,20 H9.5 Z']],
    calendar: [['M5.5,5.5 H18.5 Q20,5.5 20,7 V18.5 Q20,20 18.5,20 H5.5 Q4,20 4,18.5 V7 Q4,5.5 5.5,5.5 Z', 'M4,10 H20', 'M8,3.5 V7', 'M16,3.5 V7', 'M8,14 H9', 'M11.5,14 H12.5', 'M15,14 H16']],
    bell: [['M6,16.5 V11 Q6,5 12,5 Q18,5 18,11 V16.5 L19.5,18 H4.5 Z', 'M10,20.5 Q12,22 14,20.5', 'M12,3 V5']],
    note: [['M6.5,4 H14 L18,8 V18.5 Q18,20 16.5,20 H6.5 Q5,20 5,18.5 V5.5 Q5,4 6.5,4 Z', 'M14,4 V8 H18', 'M8.5,12 H14.5', 'M8.5,15.5 H12.5']],
    plate: [[circ(12, 12, 8.2), circ(12, 12, 2.4), 'M12,5.8 V7.2', 'M12,16.8 V18.2']],
    link: [['M10,14 L14,10', 'M9.5,11 L7.2,13.3 Q5.5,15 7.2,16.8 Q9,18.5 10.7,16.8 L13,14.5', 'M14.5,13 L16.8,10.7 Q18.5,9 16.8,7.2 Q15,5.5 13.3,7.2 L11,9.5']],
    archive: [['M4,5 H20 V9 H4 Z', 'M5.5,9 V18.5 Q5.5,20 7,20 H17 Q18.5,20 18.5,18.5 V9', 'M10,13 H14']],
    pulse: [['M3,12.5 H7 L9.2,7 L13.2,18 L15.4,12.5 H21']],
    play: [[], ['M8.5,5.6 Q8.5,4.6 9.4,5.1 L18.6,11.1 Q19.4,11.6 18.6,12.2 L9.4,18.2 Q8.5,18.7 8.5,17.7 Z']],
    spark: [['M12,3.5 L13.8,10.2 L20.5,12 L13.8,13.8 L12,20.5 L10.2,13.8 L3.5,12 L10.2,10.2 Z']],
    plus: [['M12,5 V19', 'M5,12 H19']],
    check: [['M5,12.5 L10,17.5 L19,7']],
    close: [['M6.5,6.5 L17.5,17.5', 'M17.5,6.5 L6.5,17.5']],
    search: [[circ(10.5, 10.5, 6), 'M15,15 L20,20']],
    more: [[], [circ(12, 5.5, 1.6), circ(12, 12, 1.6), circ(12, 18.5, 1.6)]],
    edit: [['M4.5,19.5 L5.2,15.6 L15.6,5.2 Q16.8,4 18,5.2 L18.8,6 Q20,7.2 18.8,8.4 L8.4,18.8 Z', 'M14,6.8 L17.2,10']],
    trash: [['M4.5,7 H19.5', 'M9.5,7 V4.8 H14.5 V7', 'M6.5,7 L7.4,19 Q7.5,20 8.5,20 H15.5 Q16.5,20 16.6,19 L17.5,7', 'M10.2,11 V16', 'M13.8,11 V16']],
    info: [[circ(12, 12, 8.5), 'M12,11 V16.5', 'M12,7.8 V8']],
    back: [['M19,12 H5.5', 'M11,6 L5,12 L11,18']],
    up: [['M6,14.5 L12,8.5 L18,14.5']],
    down: [['M6,9.5 L12,15.5 L18,9.5']],
    pause: [['M9,6 V18', 'M15,6 V18']],
    skip: [['M6,6 L14,12 L6,18 Z', 'M18,6 V18']],
    stop: [['M7,7 H17 V17 H7 Z']],
    recovery: [['M12,20 C6,16 3.5,12.5 3.5,9.3 C3.5,6.7 5.5,4.8 8,4.8 C9.6,4.8 11,5.7 12,7 C13,5.7 14.4,4.8 16,4.8 C18.5,4.8 20.5,6.7 20.5,9.3 C20.5,12.5 18,16 12,20 Z', 'M7,11.5 H9.5 L11,9 L13,14 L14.5,11.5 H17']],
    program: [['M5,5 H13', 'M5,10 H19', 'M5,15 H15', 'M5,20 H11', 'M18,16 L20,18 L23,14.5']],
  };
  function icon(name, size = 22, cls = '') {
    const d = ICONS[name]; if (!d) return '';
    const strokes = d[0].map((p) => `<path d="${p}"/>`).join('');
    const fills = (d[1] || []).map((p) => `<path d="${p}" fill="currentColor" stroke="none"/>`).join('');
    return `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${strokes}${fills}</svg>`;
  }

  // ---------------- Übungsfiguren ----------------
  const o = (x, y) => ({ x, y });
  const P = (head, shoulder, hip, kneeA, footA, kneeB, footB, elbowA, handA, elbowB, handB, arrowFrom = null, arrowTo = null) =>
    ({ head, shoulder, hip, kneeA, footA, kneeB, footB, elbowA, handA, elbowB, handB, arrowFrom, arrowTo });
  const copy = (p, ch) => Object.assign({}, p, ch);
  const STAND = P(o(.5, .14), o(.5, .27), o(.5, .55), o(.47, .72), o(.46, .9), o(.53, .72), o(.54, .9), o(.43, .41), o(.42, .54), o(.57, .41), o(.58, .54));

  function poseFor(pattern) {
    switch (pattern) {
      case 'SQUAT': return P(o(.44, .3), o(.46, .41), o(.63, .62), o(.4, .64), o(.46, .9), o(.43, .65), o(.5, .9), o(.37, .46), o(.31, .43), o(.39, .47), o(.33, .44), o(.8, .35), o(.8, .7));
      case 'LUNGE': return P(o(.5, .18), o(.5, .3), o(.5, .57), o(.67, .68), o(.69, .9), o(.38, .82), o(.24, .9), o(.45, .44), o(.45, .57), o(.55, .44), o(.55, .57), o(.85, .4), o(.85, .7));
      case 'HINGE': return P(o(.27, .37), o(.34, .41), o(.63, .5), o(.6, .7), o(.57, .9), o(.62, .7), o(.6, .9), o(.35, .53), o(.36, .65), o(.37, .53), o(.38, .65), o(.2, .7), o(.2, .3));
      case 'PUSH_H': return P(o(.17, .56), o(.27, .6), o(.58, .67), o(.74, .71), o(.9, .76), o(.74, .72), o(.9, .77), o(.26, .73), o(.27, .86), o(.29, .73), o(.3, .86), o(.45, .35), o(.45, .55));
      case 'BENCH': return P(o(.18, .6), o(.29, .62), o(.6, .62), o(.72, .6), o(.76, .86), o(.74, .61), o(.79, .86), o(.25, .48), o(.3, .32), o(.33, .48), o(.31, .32), o(.48, .5), o(.48, .26));
      case 'PUSH_V': return P(o(.5, .16), o(.5, .28), o(.5, .56), o(.47, .73), o(.46, .9), o(.53, .73), o(.54, .9), o(.38, .2), o(.42, .05), o(.62, .2), o(.58, .05), o(.82, .35), o(.82, .08));
      case 'PULL_V': return P(o(.5, .24), o(.5, .33), o(.5, .6), o(.46, .74), o(.52, .86), o(.54, .74), o(.6, .86), o(.35, .23), o(.38, .08), o(.65, .23), o(.62, .08), o(.83, .6), o(.83, .3));
      case 'PULL_H': return P(o(.28, .35), o(.35, .4), o(.63, .5), o(.6, .7), o(.57, .9), o(.62, .7), o(.6, .9), o(.5, .44), o(.42, .55), o(.52, .45), o(.44, .56), o(.42, .75), o(.42, .6));
      case 'CURL': return copy(STAND, { elbowA: o(.46, .42), handA: o(.39, .3), elbowB: o(.54, .42), handB: o(.61, .3), arrowFrom: o(.25, .55), arrowTo: o(.25, .3) });
      case 'TRICEP': return copy(STAND, { elbowA: o(.44, .14), handA: o(.48, .28), elbowB: o(.56, .14), handB: o(.52, .28), arrowFrom: o(.8, .3), arrowTo: o(.8, .08) });
      case 'RAISE': return copy(STAND, { elbowA: o(.36, .29), handA: o(.22, .3), elbowB: o(.64, .29), handB: o(.78, .3), arrowFrom: o(.15, .5), arrowTo: o(.15, .3) });
      case 'PLANK': return P(o(.17, .6), o(.28, .66), o(.58, .68), o(.74, .72), o(.9, .76), o(.74, .73), o(.9, .77), o(.27, .84), o(.38, .84), o(.29, .84), o(.4, .84));
      case 'CORE': return P(o(.3, .6), o(.37, .68), o(.57, .82), o(.68, .62), o(.8, .82), o(.7, .63), o(.82, .83), o(.3, .7), o(.28, .6), o(.33, .71), o(.31, .61), o(.25, .82), o(.4, .52));
      case 'BRIDGE': return P(o(.17, .8), o(.28, .8), o(.54, .6), o(.7, .58), o(.74, .84), o(.72, .59), o(.77, .84), o(.36, .84), o(.46, .85), o(.38, .84), o(.48, .85), o(.54, .85), o(.54, .45));
      case 'CALF': return copy(STAND, { kneeA: o(.48, .7), footA: o(.48, .86), kneeB: o(.52, .7), footB: o(.52, .86), head: o(.5, .1), shoulder: o(.5, .23), hip: o(.5, .52),
        elbowA: o(.43, .37), handA: o(.42, .5), elbowB: o(.57, .37), handB: o(.58, .5), arrowFrom: o(.75, .85), arrowTo: o(.75, .65) });
      case 'CARDIO': return P(o(.5, .16), o(.5, .28), o(.5, .55), o(.41, .72), o(.33, .9), o(.59, .72), o(.67, .9), o(.38, .18), o(.3, .07), o(.62, .18), o(.7, .07));
      case 'CARRY': return copy(STAND, { elbowA: o(.42, .43), handA: o(.39, .58), elbowB: o(.58, .43), handB: o(.61, .58), kneeA: o(.44, .72), footA: o(.38, .9), kneeB: o(.56, .72), footB: o(.6, .9), arrowFrom: o(.2, .93), arrowTo: o(.8, .93) });
      case 'STRETCH': return P(o(.42, .3), o(.45, .41), o(.52, .64), o(.7, .7), o(.72, .9), o(.38, .88), o(.22, .9), o(.4, .25), o(.36, .1), o(.55, .52), o(.62, .62));
      default: return STAND;
    }
  }
  function startFor(pattern, end) {
    switch (pattern) {
      case 'SQUAT': return P(o(.5, .14), o(.5, .27), o(.52, .55), o(.5, .72), o(.47, .9), o(.53, .72), o(.52, .9), o(.42, .31), o(.44, .24), o(.44, .32), o(.46, .25));
      case 'LUNGE': return STAND;
      case 'HINGE': return P(o(.5, .14), o(.5, .27), o(.55, .55), o(.54, .72), o(.55, .9), o(.56, .72), o(.58, .9), o(.5, .41), o(.5, .54), o(.52, .41), o(.52, .54));
      case 'PUSH_H': return copy(end, { head: o(.17, .45), shoulder: o(.27, .5), elbowA: o(.26, .68), elbowB: o(.29, .68) });
      case 'BENCH': return copy(end, { elbowA: o(.22, .58), handA: o(.3, .5), elbowB: o(.36, .58), handB: o(.31, .5) });
      case 'PUSH_V': return copy(end, { elbowA: o(.36, .31), handA: o(.4, .2), elbowB: o(.64, .31), handB: o(.6, .2) });
      case 'PULL_V': return P(o(.5, .32), o(.5, .4), o(.5, .66), o(.47, .79), o(.5, .9), o(.53, .79), o(.56, .9), o(.41, .24), o(.38, .08), o(.59, .24), o(.62, .08));
      case 'PULL_H': return copy(end, { elbowA: o(.31, .57), handA: o(.28, .7), elbowB: o(.33, .58), handB: o(.3, .71) });
      case 'CURL': return copy(end, { elbowA: o(.46, .42), handA: o(.45, .56), elbowB: o(.54, .42), handB: o(.55, .56) });
      case 'TRICEP': return copy(end, { handA: o(.46, .03), handB: o(.54, .03) });
      case 'RAISE': return copy(end, { elbowA: o(.44, .42), handA: o(.43, .55), elbowB: o(.56, .42), handB: o(.57, .55) });
      case 'CORE': return copy(end, { head: o(.19, .79), shoulder: o(.29, .82), elbowA: o(.24, .74), handA: o(.19, .7), elbowB: o(.26, .75), handB: o(.21, .71) });
      case 'BRIDGE': return copy(end, { hip: o(.52, .8), kneeA: o(.68, .64), kneeB: o(.7, .65) });
      case 'CALF': return STAND;
      case 'CARDIO': return copy(end, { kneeA: o(.47, .72), footA: o(.45, .9), kneeB: o(.53, .72), footB: o(.55, .9), elbowA: o(.4, .4), handA: o(.36, .52), elbowB: o(.6, .4), handB: o(.64, .52) });
      case 'CARRY': return copy(end, { kneeA: end.kneeB, footA: end.footB, kneeB: end.kneeA, footB: end.footA });
      default: return end;
    }
  }
  const lp = (a, b, t) => o(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
  function segsFor(m) {
    switch (m) {
      case 'Brust': case 'Rücken': return ['CHEST'];
      case 'Beine': return ['THIGH'];
      case 'Gesäß': return ['HIP'];
      case 'Schultern': return ['SHOULDER'];
      case 'Bizeps': case 'Trizeps': return ['UPPER_ARM'];
      case 'Bauch & Core': return ['BELLY'];
      case 'Waden': return ['SHANK'];
      case 'Ganzkörper': return ['ALL'];
      case 'Mobilität': return ['HIP', 'SHOULDER'];
      default: return [];
    }
  }
  function highlightPoint(m, p) {
    switch (m) {
      case 'Brust': return lp(p.shoulder, p.hip, .22);
      case 'Rücken': return lp(p.shoulder, p.hip, .35);
      case 'Beine': return lp(p.hip, p.kneeA, .55);
      case 'Gesäß': return p.hip;
      case 'Schultern': return p.shoulder;
      case 'Bizeps': return lp(p.shoulder, p.elbowA, .6);
      case 'Trizeps': return lp(p.shoulder, p.elbowB, .6);
      case 'Bauch & Core': return lp(p.shoulder, p.hip, .7);
      case 'Waden': return lp(p.kneeA, p.footA, .45);
      default: return lp(p.shoulder, p.hip, .5);
    }
  }
  // Primitive: [tag, klasse, statische Attribute, dynamische (posenabhängige) Attribute]
  function segPath(a, b, wa, wb) {
    let dx = b.x - a.x, dy = b.y - a.y; let len = Math.hypot(dx, dy);
    if (len < 0.01) { dx = 1; dy = 0; len = 1; }
    const nx = -dy / len, ny = dx / len, ra = wa / 2, rb = wb / 2;
    return `M${f2(a.x + nx * ra)},${f2(a.y + ny * ra)} L${f2(b.x + nx * rb)},${f2(b.y + ny * rb)} A${f2(rb)},${f2(rb)} 0 0,0 ${f2(b.x - nx * rb)},${f2(b.y - ny * rb)} L${f2(a.x - nx * ra)},${f2(a.y - ny * ra)} A${f2(ra)},${f2(ra)} 0 0,0 ${f2(a.x + nx * ra)},${f2(a.y + ny * ra)} Z`;
  }
  function build(pattern, equipment, muscle, pose0, showArrow) {
    const s = 100, S = (p) => o(p.x * s, p.y * s), limb = s * 0.06;
    const out = [];
    const segs = segsFor(muscle), all = segs.includes('ALL');
    const add = (tag, cls, st, dyn) => out.push([tag, cls, st || {}, dyn || {}]);
    const seg = (cls, a, b, wa, wb) => add('path', cls, {}, { d: segPath(a, b, wa, wb) });
    // Boden + Schatten
    const minX = Math.min(pose0.footA.x, pose0.footB.x, pose0.hip.x, pose0.head.x), maxX = Math.max(pose0.footA.x, pose0.footB.x, pose0.hip.x, pose0.head.x);
    const cx = (minX + maxX) / 2, w = Math.max(maxX - minX, .2) * .6 + .08;
    add('ellipse', 'fsh', { cy: 92.5, ry: 2.5 }, { cx: f2(cx * s), rx: f2(w * s) });
    add('line', 'sfl', { x1: 8, y1: 92.5, x2: 92, y2: 92.5, 'stroke-width': 1, 'stroke-linecap': 'round' });
    // Geräte-Umgebung
    if (pattern === 'BENCH' || (pattern === 'BRIDGE' && equipment === 'Langhantel') || (equipment === 'Bank/Box' && ['TRICEP', 'PUSH_H', 'BRIDGE'].includes(pattern))) {
      add('rect', 'ffl', { x: 13, y: 65.5, width: 52, height: 5.5, rx: 2.5 });
      add('rect', 'ffl', { x: 19, y: 70, width: 3, height: 22, rx: 1, opacity: .8 });
      add('rect', 'ffl', { x: 57, y: 70, width: 3, height: 22, rx: 1, opacity: .8 });
    }
    if (pattern === 'PULL_V') {
      add('line', 'sfl', { x1: 16, y1: 6, x2: 16, y2: 92.5, 'stroke-width': 2, 'stroke-linecap': 'round' });
      add('line', 'sfl', { x1: 84, y1: 6, x2: 84, y2: 92.5, 'stroke-width': 2, 'stroke-linecap': 'round' });
      add('line', 'sge', { x1: 16, y1: 8, x2: 84, y2: 8, 'stroke-width': 2.8, 'stroke-linecap': 'round' });
    }
    if (equipment === 'Maschine/Kabel') {
      add('rect', 'ffl', { x: 86, y: 5, width: 6, height: 87.5, rx: 2, opacity: .7 });
      add('circle', 'sge', { cx: 89, cy: 20, r: 3, 'stroke-width': 1.2, fill: 'none' });
    }
    const pose = pose0;
    const hp = S(highlightPoint(muscle, pose));
    add('circle', 'fglow', { r: 20 }, { cx: f2(hp.x), cy: f2(hp.y) });
    const hl = (k) => all || segs.includes(k);
    const bc = (k) => (hl(k) ? 'fac bk' : 'fbo bk'), fc = (k) => (hl(k) ? 'fac' : 'fbo');
    seg(bc('THIGH'), S(pose.hip), S(pose.kneeB), limb * 1.25, limb * .95);
    seg(bc('SHANK'), S(pose.kneeB), S(pose.footB), limb * .95, limb * .7);
    seg(bc('UPPER_ARM'), S(pose.shoulder), S(pose.elbowB), limb * .95, limb * .75);
    seg(bc('FOREARM'), S(pose.elbowB), S(pose.handB), limb * .75, limb * .6);
    const sh = S(pose.shoulder), hip = S(pose.hip), mid = lp(sh, hip, .5);
    seg(fc('CHEST'), sh, mid, limb * 1.9, limb * 1.55);
    seg(fc('BELLY'), mid, hip, limb * 1.55, limb * 1.45);
    if (segs.includes('HIP') || all) add('circle', 'fac', { r: f2(limb * .85) }, { cx: f2(hip.x), cy: f2(hip.y) });
    const headC = S(pose.head);
    seg('fbo', sh, lp(sh, headC, .7), limb * .7, limb * .6);
    add('circle', 'fbo', { r: 6.8 }, { cx: f2(headC.x), cy: f2(headC.y) });
    add('circle', 'fwh', { r: 3 }, { cx: f2(headC.x - 2), cy: f2(headC.y - 2) });
    seg(fc('THIGH'), hip, S(pose.kneeA), limb * 1.3, limb);
    seg(fc('SHANK'), S(pose.kneeA), S(pose.footA), limb, limb * .72);
    const foot = (cls, knee, ft) => { const dir = knee.x < ft.x - limb * .2 ? -1 : 1; seg(cls, ft, o(ft.x + dir * limb * 1.3, ft.y + limb * .15), limb * .7, limb * .5); };
    foot('fbo', S(pose.kneeA), S(pose.footA));
    foot('fbo bk', S(pose.kneeB), S(pose.footB));
    if (segs.includes('SHOULDER') || all) add('circle', 'fac', { r: f2(limb) }, { cx: f2(sh.x), cy: f2(sh.y) });
    seg(fc('UPPER_ARM'), sh, S(pose.elbowA), limb, limb * .8);
    seg(fc('FOREARM'), S(pose.elbowA), S(pose.handA), limb * .8, limb * .62);
    // Gerät an den Händen
    const hA = S(pose.handA), hB = S(pose.handB);
    const plate = (c) => { add('circle', 'fge', { r: 9.5, opacity: .85 }, { cx: f2(c.x), cy: f2(c.y) }); add('circle', 'sbl', { r: 7, fill: 'none', 'stroke-width': 1 }, { cx: f2(c.x), cy: f2(c.y) }); add('circle', 'fge', { r: 2.2 }, { cx: f2(c.x), cy: f2(c.y) }); };
    const dumbbell = (at, alpha) => {
      add('line', 'sge', { 'stroke-width': 1.6, 'stroke-linecap': 'round', opacity: alpha }, { x1: f2(at.x - 5), y1: f2(at.y), x2: f2(at.x + 5), y2: f2(at.y) });
      add('rect', 'fge', { width: 3.5, height: 7.6, rx: 1.2, opacity: alpha }, { x: f2(at.x - 7.5), y: f2(at.y - 3.8) });
      add('rect', 'fge', { width: 3.5, height: 7.6, rx: 1.2, opacity: alpha }, { x: f2(at.x + 4), y: f2(at.y - 3.8) });
    };
    switch (equipment) {
      case 'Langhantel': {
        const m = lp(hA, hB, .5);
        if (['PUSH_V', 'CURL', 'BENCH', 'HINGE', 'PULL_H', 'SQUAT', 'BRIDGE', 'LUNGE', 'CALF'].includes(pattern)) {
          const c = ['SQUAT', 'LUNGE', 'CALF'].includes(pattern) ? o(sh.x + limb * .3, sh.y - limb * .4) : pattern === 'BRIDGE' ? o(hip.x, hip.y - limb) : m;
          plate(c);
        } else {
          add('line', 'sge', { 'stroke-width': 1.8, 'stroke-linecap': 'round' }, { x1: f2(m.x - 30), y1: f2(m.y), x2: f2(m.x + 30), y2: f2(m.y) });
          add('rect', 'fge', { width: 4, height: 12, rx: 1.2 }, { x: f2(m.x - 34), y: f2(m.y - 6) });
          add('rect', 'fge', { width: 4, height: 12, rx: 1.2 }, { x: f2(m.x + 30), y: f2(m.y - 6) });
        }
        break;
      }
      case 'Kurzhantel': dumbbell(hB, .55); dumbbell(hA, 1); break;
      case 'Kettlebell': { const c = lp(hA, hB, .5); add('circle', 'sge', { r: 2.2, fill: 'none', 'stroke-width': 1.4 }, { cx: f2(c.x), cy: f2(c.y) }); add('rect', 'fge', { width: 11, height: 10, rx: 4.5 }, { x: f2(c.x - 5.5), y: f2(c.y + 1.5) }); break; }
      case 'Widerstandsband': { const to = pattern === 'PULL_H' || pattern === 'PUSH_V' ? o(50, 92) : hB; add('line', 'sge', { 'stroke-width': 1.4, 'stroke-dasharray': '3 1.8', 'stroke-linecap': 'round' }, { x1: f2(hA.x), y1: f2(hA.y), x2: f2(to.x), y2: f2(to.y) }); break; }
      case 'Maschine/Kabel':
        add('line', 'sge', { x2: 89, y2: 20, 'stroke-width': .9 }, { x1: f2(hA.x), y1: f2(hA.y) });
        add('rect', 'fge', { width: 7, height: 2.4, rx: 1.2 }, { x: f2(hA.x - 3.5), y: f2(hA.y - 1.2) });
        break;
      default: break;
    }
    if (showArrow && pose.arrowFrom && pose.arrowTo) {
      const a = S(pose.arrowFrom), b = S(pose.arrowTo);
      add('line', 'sac', { x1: f2(a.x), y1: f2(a.y), x2: f2(b.x), y2: f2(b.y), 'stroke-width': 1.6, 'stroke-dasharray': '3.5 2.5', 'stroke-linecap': 'round', opacity: .85 });
      const len = Math.max(Math.hypot(b.x - a.x, b.y - a.y), 1), ux = (b.x - a.x) / len, uy = (b.y - a.y) / len, h = 5;
      add('path', 'fac', { d: `M${f2(b.x)},${f2(b.y)} L${f2(b.x - ux * h - uy * h * .6)},${f2(b.y - uy * h + ux * h * .6)} L${f2(b.x - ux * h + uy * h * .6)},${f2(b.y - uy * h - ux * h * .6)} Z` });
    }
    return out;
  }
  const attrs = (o2) => Object.entries(o2).map(([k, v]) => `${k}="${v}"`).join(' ');
  /** Übungsgrafik als SVG. opt: {arrow, animate, cls} */
  function figure(ex, opt = {}) {
    const pattern = ex.pattern, equipment = ex.equipment, muscle = ex.muscleGroup;
    const end = poseFor(pattern), start = startFor(pattern, end);
    const animate = !!opt.animate && start !== end;
    const fEnd = build(pattern, equipment, muscle, end, opt.arrow !== false && !opt.animate);
    let body;
    if (animate) {
      const fStart = build(pattern, equipment, muscle, start, false);
      body = fEnd.map((p, i) => {
        const q = fStart[i] || p;
        const anims = Object.keys(p[3]).filter((k) => String(p[3][k]) !== String(q[3][k])).map((k) =>
          `<animate attributeName="${k}" values="${q[3][k]};${p[3][k]};${q[3][k]}" dur="2.8s" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" repeatCount="indefinite"/>`).join('');
        return `<${p[0]} class="${p[1]}" ${attrs(Object.assign({}, p[2], q[3]))}>${anims}</${p[0]}>`;
      }).join('');
    } else body = fEnd.map((p) => `<${p[0]} class="${p[1]}" ${attrs(Object.assign({}, p[2], p[3]))}/>`).join('');
    return `<svg class="fig ${opt.cls || ''}" viewBox="0 0 100 100" aria-hidden="true">${body}</svg>`;
  }

  // ---------------- Diagramme ----------------
  function lineChart(values, opt = {}) {
    const W = 340, H = 140;
    let grid = ''; for (let i = 0; i <= 3; i++) { const y = f2(H * i / 3); grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" class="sgrid" stroke-width="1"/>`; }
    let inner = '';
    if (values.length) {
      const min = Math.min(...values), max = Math.max(...values), span = max - min > 1e-9 ? max - min : 1, pad = H * 0.08;
      const pt = (i) => ({ x: values.length === 1 ? W / 2 : W * i / (values.length - 1), y: H - pad - ((values[i] - min) / span) * (H - 2 * pad) });
      const pts = values.map((_, i) => pt(i));
      const line = pts.map((p, i) => (i ? 'L' : 'M') + f2(p.x) + ',' + f2(p.y)).join(' ');
      const fill = `M${f2(pts[0].x)},${H} ` + pts.map((p) => 'L' + f2(p.x) + ',' + f2(p.y)).join(' ') + ` L${f2(pts[pts.length - 1].x)},${H} Z`;
      const c = opt.color || 'var(--primary)';
      inner = `<path d="${fill}" style="fill:${c}" fill-opacity=".22"/><path d="${line}" fill="none" style="stroke:${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` +
        pts.map((p, i) => (values.length <= 30 || i === values.length - 1 ? `<circle cx="${f2(p.x)}" cy="${f2(p.y)}" r="3.5" style="fill:${c}"/>` : '')).join('') +
        `<circle cx="${f2(pts[pts.length - 1].x)}" cy="${f2(pts[pts.length - 1].y)}" r="2" fill="#fff"/>`;
    }
    return `<div class="chart">${opt.maxLabel ? `<div class="clab">${opt.maxLabel}</div>` : ''}<svg viewBox="0 0 ${W} ${H}" class="csvg" preserveAspectRatio="none" style="overflow:visible">${grid}${inner}</svg>${opt.minLabel ? `<div class="clab">${opt.minLabel}</div>` : ''}</div>`;
  }
  function barChart(values, labels, opt = {}) {
    const W = 340, H = 130;
    let inner = '';
    if (values.length) {
      const max = Math.max(...values) > 0 ? Math.max(...values) : 1, slot = W / values.length, bw = slot * 0.62;
      const c = opt.color || 'var(--secondary)';
      values.forEach((v, i) => {
        const x = f2(i * slot + (slot - bw) / 2);
        inner += `<rect x="${x}" y="0" width="${f2(bw)}" height="${H}" rx="${f2(bw / 2)}" class="ftrack"/>`;
        const bh = (v / max) * H;
        if (bh > 0) inner += `<rect x="${x}" y="${f2(H - bh)}" width="${f2(bw)}" height="${f2(bh)}" rx="${f2(Math.min(bw / 2, bh / 2))}" style="fill:${c}"/>`;
      });
    }
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" class="csvg bar">${inner}</svg><div class="blabels">${labels.map((l) => `<span>${l}</span>`).join('')}</div></div>`;
  }
  function heatmap(intensity, today, weeks = 18) {
    const LF = g.LF;
    const maxV = Math.max(1, ...Object.values(intensity));
    const thisMonday = today - (LF.isoDow(today) - 1);
    const firstMonday = thisMonday - (weeks - 1) * 7;
    const gap = 3, cell = 14, W = weeks * cell + (weeks - 1) * gap, H = 7 * cell + 6 * gap;
    let r = '';
    for (let w = 0; w < weeks; w++) for (let d = 0; d < 7; d++) {
      const day = firstMonday + w * 7 + d;
      if (day > today) continue;
      const v = intensity[day] || 0;
      r += v <= 0 ? `<rect x="${w * (cell + gap)}" y="${d * (cell + gap)}" width="${cell}" height="${cell}" rx="3.5" class="ftrack"/>`
        : `<rect x="${w * (cell + gap)}" y="${d * (cell + gap)}" width="${cell}" height="${cell}" rx="3.5" class="fac" fill-opacity="${f2(0.3 + 0.7 * (v / maxV))}" data-day="${day}"/>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" class="heat">${r}</svg>`;
  }
  /** Fortschrittsring mit Inhalt in der Mitte */
  function ring(progress, size, stroke, color, inner = '', live = '') {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, p = Math.min(1, Math.max(0, progress || 0));
    return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="strack" stroke-width="${stroke}" fill="none"/>` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${stroke}" stroke-linecap="round" style="stroke:${color};transition:stroke-dashoffset .5s,stroke .3s" ${live ? `data-live="${live}"` : ''}
       stroke-dasharray="${f2(c)}" stroke-dashoffset="${f2(c * (1 - p))}" data-c="${f2(c)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg><div class="rin">${inner}</div></div>`;
  }
  const bar = (progress, color = 'var(--primary)', h = 10, live = '') =>
    `<div class="pbar" style="height:${h}px"><i style="width:${f2(Math.min(1, Math.max(0, progress || 0)) * 100)}%;background:${color}" ${live ? `data-live="${live}"` : ''}></i></div>`;

  // ---------------- Rekord-Feier (Konfetti) ----------------
  function confetti(canvas, seed) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);
    let x = seed % 2147483647 || 7; const rnd = () => (x = (x * 16807) % 2147483647) / 2147483647;
    const cs = getComputedStyle(document.documentElement);
    const palette = ['--primary', '--secondary', '--amber', '--coral', '--sky'].map((v) => cs.getPropertyValue(v).trim() || '#3DF5C8');
    const parts = Array.from({ length: 90 }, () => ({ a: rnd() * Math.PI * 2, sp: 0.35 + rnd() * 0.75, spin: rnd() * 720 - 360, c: palette[Math.floor(rnd() * palette.length)], w: 6 + rnd() * 8, h: 4 + rnd() * 5 }));
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 2600);
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H * 0.42, maxDist = Math.min(W, H) * 0.75;
      for (const q of parts) {
        const dist = maxDist * q.sp * (1 - (1 - p) * (1 - p));
        const grav = H * 0.35 * p * p;
        const px = cx + Math.cos(q.a) * dist, py = cy + Math.sin(q.a) * dist + grav;
        ctx.save(); ctx.globalAlpha = Math.max(0, 1 - p); ctx.translate(px, py); ctx.rotate((q.spin * p * Math.PI) / 180);
        ctx.fillStyle = q.c; ctx.fillRect(-q.w / 2, -q.h / 2, q.w, q.h); ctx.restore();
      }
      if (p < 1 && canvas.isConnected) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  g.ART = { icon, figure, lineChart, barChart, heatmap, ring, bar, confetti };
})(window);
