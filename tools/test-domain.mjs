// Prüft die portierte Rechenlogik (domain.js) gegen bekannte Werte aus den Kotlin-Tests/Formeln.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', 'www');
const g = {}; vm.createContext(g); vm.runInContext(fs.readFileSync(path.join(dir, 'domain.js'), 'utf8').replace('typeof window !== \'undefined\' ? window : globalThis', 'globalThis'), g);
const { LF } = g;
let fail = 0; const eq = (n, a, b) => { const ok = JSON.stringify(a) === JSON.stringify(b); if (!ok) fail++; console.log((ok ? 'OK   ' : 'FEHL ') + n + (ok ? '' : ` → ${JSON.stringify(a)} statt ${JSON.stringify(b)}`)); };
// IntervalEngine: stateAt == n-mal tick
for (const c of [{ prepareSec: 10, workSec: 20, restSec: 10, rounds: 8 }, { prepareSec: 0, workSec: 60, restSec: 0, rounds: 3 }, { prepareSec: 5, workSec: 45, restSec: 15, rounds: 2 }]) {
  let s = LF.Interval.start(c), okAll = true;
  for (let e = 0; e <= LF.Interval.totalSec(c) + 2; e++) { const a = LF.Interval.stateAt(c, e); if (a.phase !== s.phase || a.round !== s.round || a.remainingSec !== s.remainingSec) { okAll = false; break; } s = LF.Interval.tick(s); }
  eq('stateAt == tick ' + JSON.stringify(c), okAll, true);
}
eq('Units.number 82.5', LF.Units.number(82.5), '82,5');
eq('Units.number 80.0', LF.Units.number(80), '80');
eq('Units.number 0.75,2', LF.Units.number(0.75, 2), '0,75');
eq('Units.weight lbs', LF.Units.weight(100, 'LBS'), '220,5 lbs');
eq('Epley 100x5', Math.round(LF.OneRepMax.epley(100, 5) * 100) / 100, 116.67);
eq('Brzycki 100x5', Math.round(LF.OneRepMax.brzycki(100, 5) * 100) / 100, 112.5);
eq('Estimate 100x12 = Epley', LF.OneRepMax.estimate(100, 12), LF.OneRepMax.epley(100, 12));
eq('Progression erhöhen', LF.Progression.suggest([{ weight: 60, reps: 8 }, { weight: 60, reps: 8 }], 5, 8, 2.5), { weight: 62.5, reps: 5, reason: 'Alle Sätze bei 8+ Wdh. geschafft – Gewicht erhöhen' });
eq('Progression halten', LF.Progression.suggest([{ weight: 60, reps: 4 }], 5, 8, 2.5).reason, 'Zielbereich noch nicht erreicht – Gewicht halten');
eq('Plates 100/20', LF.PlateCalculator.compute(100, 20, LF.PlateCalculator.KG_PLATES).perSide, [25, 15]);
eq('Warmup 100', LF.WarmupCalculator.ramp(100, 20, 2.5), [{ weight: 20, reps: 10 }, { weight: 50, reps: 5 }, { weight: 70, reps: 3 }, { weight: 85, reps: 2 }]);
eq('Streak', LF.Streak.current(new Set([10, 9, 8, 5]), 11), 3);
eq('Streak longest', LF.Streak.longest(new Set([1, 2, 3, 7, 8])), 3);
eq('weekStart Do 1.1.1970 -> Mo', LF.Stats.weekStart(0), -3);
eq('formatDuration', [LF.Stats.formatDuration(75), LF.Stats.formatDuration(3725)], ['1:15', '1:02:05']);
eq('Superset assign', LF.SupersetGroups.assign([false, true, false, true, true, false]), [0, 1, 1, 2, 2, 2]);
eq('Superset links', LF.SupersetGroups.links([0, 1, 1, 2, 2, 2]), [false, true, false, true, true, false]);
eq('Recovery 3 Sätze Brust jetzt', LF.RecoveryCalc.compute([1, 2, 3].map(() => ({ muscleGroup: 'Brust', createdAt: 0, setType: 'NORMAL' })), 0)[0].percent, 64);
eq('RIR', [LF.SetType.rir(8), LF.SetType.rir(10), LF.SetType.rir(3)], [2, 0, 6]);
console.log(fail ? fail + ' Fehler' : 'Alle Domain-Tests bestanden');
process.exitCode = fail ? 1 : 0;
