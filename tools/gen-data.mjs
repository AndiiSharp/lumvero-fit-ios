// Erzeugt www/data.js aus der Android-Quelle SeedData.kt (nur lesend).
// Aufruf: node tools/gen-data.mjs
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'C:/Users/Andrej/projekte/lumvero-fit/app/src/main/java/de/lumvero/fit/data/SeedData.kt';
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', 'www', 'data.js');
const kt = fs.readFileSync(SRC, 'utf8');

function objectConsts(name) {
  const start = kt.indexOf(`object ${name} {`);
  const body = kt.slice(start, kt.indexOf('val ALL', start));
  const map = {};
  for (const m of body.matchAll(/const val (\w+) = "([^"]*)"/g)) map[m[1]] = m[2];
  return map;
}
const Muscle = objectConsts('Muscle');
const Equip = objectConsts('Equip');
const Pattern = objectConsts('Pattern');
const order = (name, map) => {
  const start = kt.indexOf(`object ${name} {`);
  const m = /val ALL = listOf\(([^)]*)\)/.exec(kt.slice(start));
  return m[1].split(',').map((s) => map[s.trim()]);
};
const muscles = order('Muscle', Muscle), equips = order('Equip', Equip), patterns = order('Pattern', Pattern);

const labelBody = kt.slice(kt.indexOf('fun label(p: String)'), kt.indexOf('fun suggestFor'));
const patternLabels = {};
for (const m of labelBody.matchAll(/(\w+) -> "([^"]*)"/g)) patternLabels[Pattern[m[1]]] = m[2];
const sugBody = kt.slice(kt.indexOf('fun suggestFor'), kt.indexOf('val exercises'));
const patternSuggest = {};
for (const m of sugBody.matchAll(/Muscle\.(\w+) -> (\w+)/g)) patternSuggest[Muscle[m[1]]] = Pattern[m[2]];

const TRACK = { WEIGHT_REPS: 'WEIGHT_REPS', REPS: 'REPS', TIME: 'TIME' };
const exercises = [];
for (const m of kt.matchAll(/e\("([^"]+)",\s*"([^"]+)",\s*Muscle\.(\w+),\s*Equip\.(\w+),\s*Pattern\.(\w+),\s*(\w+),\s*"([^"]*)"\)/g)) {
  exercises.push({
    key: m[1], name: m[2], muscleGroup: Muscle[m[3]], equipment: Equip[m[4]], pattern: Pattern[m[5]], trackType: TRACK[m[6]],
    instructions: m[7].split('|').map((s) => s.trim()).join('\n'),
  });
}

function planSeeds(block) {
  const out = [];
  const starts = [...block.matchAll(/PlanSeed\("([^"]*)",\s*"([^"]*)",\s*"([^"]*)",\s*listOf\(/g)];
  starts.forEach((s, idx) => {
    const end = idx + 1 < starts.length ? starts[idx + 1].index : block.length;
    const part = block.slice(s.index, end);
    const items = [...part.matchAll(/i\("(\w+)",\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*superset\s*=\s*(\d+))?\)/g)].map((m) => ({
      key: m[1], sets: +m[2], minReps: +m[3], maxReps: +m[4], rest: +m[5], superset: m[6] ? +m[6] : 0,
    }));
    out.push({ name: s[1], description: s[2], category: s[3], items });
  });
  return out;
}
const iPlans = kt.indexOf('val plans: List<PlanSeed>'), iProg = kt.indexOf('val programs: List<PlanSeed>'), iMeas = kt.indexOf('val measurementKinds');
const plans = planSeeds(kt.slice(iPlans, iProg));
const programs = planSeeds(kt.slice(iProg, iMeas));
const measurementKinds = /val measurementKinds = listOf\(([^)]*)\)/.exec(kt)[1].match(/"([^"]*)"/g).map((s) => s.slice(1, -1));

const keys = new Set(exercises.map((e) => e.key));
for (const p of [...plans, ...programs]) for (const it of p.items) if (!keys.has(it.key)) throw new Error('Unbekannte Übung im Plan: ' + it.key);
if (exercises.length !== 79 || plans.length !== 8 || programs.length !== 8) throw new Error(`Zählung stimmt nicht: ${exercises.length}/${plans.length}/${programs.length}`);

const data = { muscles, equips, patterns, patternLabels, patternSuggest, exercises, plans, programs, measurementKinds };
fs.writeFileSync(OUT, '// AUTOMATISCH ERZEUGT aus SeedData.kt (tools/gen-data.mjs) – nicht von Hand ändern.\n' +
  "'use strict';\nwindow.SEED = " + JSON.stringify(data, null, 1) + ';\n', 'utf8');
console.log('OK', exercises.length, 'Übungen,', plans.length, 'Pläne,', programs.length, 'Programme,', measurementKinds.length, 'Maße ->', OUT);
