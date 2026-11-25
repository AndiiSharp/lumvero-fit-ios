'use strict';
/* Lumvero Fit – Rechenlogik, 1:1 portiert aus domain/*.kt der Android-App (Progression, OneRepMax, Streak,
   Recovery/RecoveryCalc, IntervalEngine, PlateCalculator, WarmupCalculator, Units, Stats, SupersetGroups). */
(function (g) {
  const LB_PER_KG = 2.20462262185;
  const roundHalfUp = (x) => Math.round(x); // entspricht Kotlin roundToInt/roundToLong

  const SetType = {
    NORMAL: 'NORMAL', WARMUP: 'WARMUP', DROP: 'DROP', FAILURE: 'FAILURE',
    ALL: ['NORMAL', 'WARMUP', 'DROP', 'FAILURE'],
    short: (t) => (t === 'WARMUP' ? 'W' : t === 'DROP' ? 'D' : t === 'FAILURE' ? 'F' : ''),
    label: (t) => (t === 'WARMUP' ? 'Aufwärmen' : t === 'DROP' ? 'Dropsatz' : t === 'FAILURE' ? 'Muskelversagen' : 'Arbeitssatz'),
    countsForStats: (t) => t !== 'WARMUP',
    startsRest: (t) => t !== 'DROP',
    rir: (rpe) => (rpe == null ? null : Math.min(6, Math.max(0, roundHalfUp(10 - rpe)))),
  };

  const OneRepMax = {
    epley(w, r) { if (w <= 0 || r <= 0) return 0; if (r === 1) return w; return w * (1 + r / 30); },
    brzycki(w, r) { if (w <= 0 || r <= 0) return 0; if (r === 1) return w; if (r >= 37) return OneRepMax.epley(w, r); return w * 36 / (37 - r); },
    estimate(w, r) {
      if (w <= 0 || r <= 0) return 0;
      if (r === 1) return w;
      if (r <= 10) return (OneRepMax.epley(w, r) + OneRepMax.brzycki(w, r)) / 2;
      return OneRepMax.epley(w, r);
    },
  };

  const Progression = {
    roundToStep(value, step) { if (step <= 0) return value; return roundHalfUp(value / step) * step; },
    /** last: [{weight, reps}] Arbeitssätze der letzten Einheit */
    suggest(last, minReps, maxReps, increment) {
      const working = last.filter((s) => s.reps > 0);
      if (!working.length) return null;
      const lo = Math.max(1, minReps);
      const hi = Math.max(lo, maxReps);
      const topWeight = Math.max(...working.map((s) => s.weight));
      const topSets = working.filter((s) => s.weight === topWeight);
      const minRepsDone = Math.min(...topSets.map((s) => s.reps));
      if (topWeight <= 0) return { weight: 0, reps: minRepsDone + 1, reason: 'Körpergewicht: eine Wiederholung mehr als zuletzt' };
      if (minRepsDone >= hi) return { weight: Progression.roundToStep(topWeight + increment, increment > 0 ? increment : 0.5), reps: lo, reason: `Alle Sätze bei ${hi}+ Wdh. geschafft – Gewicht erhöhen` };
      if (minRepsDone < lo) return { weight: topWeight, reps: lo, reason: 'Zielbereich noch nicht erreicht – Gewicht halten' };
      return { weight: topWeight, reps: Math.min(minRepsDone + 1, hi), reason: 'Im Zielbereich – eine Wiederholung mehr anpeilen' };
    },
  };

  const PlateCalculator = {
    KG_PLATES: [25, 20, 15, 10, 5, 2.5, 1.25],
    LB_PLATES: [45, 35, 25, 10, 5, 2.5],
    compute(target, bar, plates) {
      if (target <= bar + 1e-9) return { perSide: [], achievedTotal: bar, remainder: target - bar };
      let side = (target - bar) / 2;
      const out = [];
      for (const p of [...plates].sort((a, b) => b - a)) { while (side >= p - 1e-9) { out.push(p); side -= p; } }
      const achieved = bar + 2 * out.reduce((a, b) => a + b, 0);
      return { perSide: out, achievedTotal: achieved, remainder: target - achieved };
    },
  };

  const WarmupCalculator = {
    steps: [[0.5, 5], [0.7, 3], [0.85, 2]],
    ramp(work, bar, increment) {
      if (work <= 0) return [];
      const inc = increment > 0 ? increment : 2.5;
      const out = [];
      if (bar > 0 && work > bar) out.push({ weight: bar, reps: 10 });
      for (const [pct, reps] of WarmupCalculator.steps) {
        const w = Math.max(bar, Progression.roundToStep(work * pct, inc));
        if (w <= 0 || w >= work - 1e-9) continue;
        if (out.some((o) => Math.abs(o.weight - w) < 1e-9)) continue;
        out.push({ weight: w, reps });
      }
      return out;
    },
  };

  const Recovery = {
    POINTS_PER_SET: 12,
    recoveryHours: (m) => (['Beine', 'Rücken', 'Gesäß', 'Brust'].includes(m) ? 72 : 48),
    percent(loads, hours) {
      const fatigue = loads.reduce((acc, [h, sets]) => acc + (h < 0 || h >= hours ? 0 : sets * Recovery.POINTS_PER_SET * (1 - h / hours)), 0);
      return Math.min(100, Math.max(0, roundHalfUp(100 - fatigue)));
    },
    distribute(m) {
      if (m === 'Ganzkörper') return [['Beine', 0.5], ['Brust', 0.35], ['Rücken', 0.5], ['Schultern', 0.35], ['Bauch & Core', 0.35]];
      if (m === 'Mobilität') return [];
      return [[m, 1]];
    },
    TRACKED: ['Brust', 'Rücken', 'Schultern', 'Bizeps', 'Trizeps', 'Beine', 'Gesäß', 'Waden', 'Bauch & Core'],
  };

  const RecoveryCalc = {
    /** sets: [{muscleGroup, createdAt, setType}] */
    compute(sets, now) {
      const loads = {}, last = {};
      for (const s of sets) {
        if (!SetType.countsForStats(s.setType)) continue;
        const h = (now - s.createdAt) / 3600000;
        if (h < 0 || h > 24 * 7) continue;
        for (const [m, w] of Recovery.distribute(s.muscleGroup)) {
          (loads[m] = loads[m] || []).push([h, w]);
          last[m] = Math.min(last[m] == null ? Number.MAX_VALUE : last[m], h);
        }
      }
      return Recovery.TRACKED.map((m) => ({ muscle: m, percent: Recovery.percent(loads[m] || [], Recovery.recoveryHours(m)), hoursSinceLast: last[m] == null ? null : last[m] }));
    },
  };

  const Streak = {
    current(activeDays, today) {
      let day = activeDays.has(today) ? today : today - 1;
      let count = 0;
      while (activeDays.has(day)) { count++; day--; }
      return count;
    },
    longest(activeDays) {
      if (!activeDays.size) return 0;
      const sorted = [...activeDays].sort((a, b) => a - b);
      let best = 1, run = 1;
      for (let i = 1; i < sorted.length; i++) { run = sorted[i] === sorted[i - 1] + 1 ? run + 1 : 1; if (run > best) best = run; }
      return best;
    },
  };

  // ---------- Intervall-Timer (IntervalTimer.kt) ----------
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const Interval = {
    sanitized: (c) => ({ prepareSec: clamp(c.prepareSec, 0, 600), workSec: clamp(c.workSec, 1, 3600), restSec: clamp(c.restSec, 0, 3600), rounds: clamp(c.rounds, 1, 99) }),
    totalSec: (c) => c.prepareSec + c.rounds * c.workSec + Math.max(0, c.rounds - 1) * c.restSec,
    state: (phase, round, remainingSec, elapsedSec, config) => ({ phase, round, remainingSec, elapsedSec, config }),
    isRunningPhase: (s) => s.phase === 'PREPARE' || s.phase === 'WORK' || s.phase === 'REST',
    phaseLength: (s) => (s.phase === 'PREPARE' ? s.config.prepareSec : s.phase === 'WORK' ? s.config.workSec : s.phase === 'REST' ? s.config.restSec : 0),
    phaseProgress: (s) => { const l = Interval.phaseLength(s); return l <= 0 ? 0 : 1 - s.remainingSec / l; },
    totalProgress: (s) => { const t = Interval.totalSec(s.config); return t <= 0 ? 0 : clamp(s.elapsedSec / t, 0, 1); },
    start(config) {
      const c = Interval.sanitized(config);
      return c.prepareSec > 0 ? Interval.state('PREPARE', 1, c.prepareSec, 0, c) : Interval.state('WORK', 1, c.workSec, 0, c);
    },
    tick(s) {
      if (!Interval.isRunningPhase(s)) return s;
      const remaining = s.remainingSec - 1, elapsed = s.elapsedSec + 1, c = s.config;
      if (remaining > 0) return { ...s, remainingSec: remaining, elapsedSec: elapsed };
      switch (s.phase) {
        case 'PREPARE': return { ...s, phase: 'WORK', round: 1, remainingSec: c.workSec, elapsedSec: elapsed };
        case 'WORK':
          if (s.round >= c.rounds) return { ...s, phase: 'DONE', remainingSec: 0, elapsedSec: elapsed };
          if (c.restSec > 0) return { ...s, phase: 'REST', remainingSec: c.restSec, elapsedSec: elapsed };
          return { ...s, phase: 'WORK', round: s.round + 1, remainingSec: c.workSec, elapsedSec: elapsed };
        case 'REST': return { ...s, phase: 'WORK', round: s.round + 1, remainingSec: c.workSec, elapsedSec: elapsed };
        default: return s;
      }
    },
    skip(s) {
      if (!Interval.isRunningPhase(s)) return s;
      const phase = s.phase, round = s.round;
      while (Interval.isRunningPhase(s) && s.phase === phase && s.round === round) s = Interval.tick(s);
      return s;
    },
    /** Zustand aus der seit dem Start vergangenen Zeit (zeitstempelbasiert) */
    stateAt(config, elapsedSec) {
      const c = Interval.sanitized(config);
      const e = Math.max(0, elapsedSec);
      const total = Interval.totalSec(c);
      if (e >= total) return Interval.state('DONE', c.rounds, 0, total, c);
      let t = e;
      if (c.prepareSec > 0) {
        if (t < c.prepareSec) return Interval.state('PREPARE', 1, c.prepareSec - t, e, c);
        t -= c.prepareSec;
      }
      const cycle = c.workSec + c.restSec;
      const round = Math.floor(t / cycle) + 1;
      const inCycle = t % cycle;
      return inCycle < c.workSec ? Interval.state('WORK', round, c.workSec - inCycle, e, c) : Interval.state('REST', round, cycle - inCycle, e, c);
    },
  };

  // ---------- Units & Stats (Units.kt) ----------
  const Units = {
    LB_PER_KG,
    toDisplay: (kg, unit) => (unit === 'KG' ? kg : kg * LB_PER_KG),
    toKg: (v, unit) => (unit === 'KG' ? v : v / LB_PER_KG),
    label: (unit) => (unit === 'KG' ? 'kg' : 'lbs'),
    number(value, decimals = 1) {
      const factor = Math.pow(10, decimals);
      const rounded = roundHalfUp(value * factor) / factor;
      if (Math.abs(rounded - roundHalfUp(rounded)) < 1e-9) return String(roundHalfUp(rounded)).replace(/^-0$/, '0');
      return rounded.toFixed(decimals).replace('.', ',');
    },
    weight: (kg, unit, decimals = 1) => Units.number(Units.toDisplay(kg, unit), decimals) + ' ' + Units.label(unit),
  };

  const Stats = {
    volume: (sets) => sets.reduce((a, s) => a + s.weight * s.reps, 0),
    movingAverage(values, window) {
      if (window <= 1) return values;
      return values.map((_, i) => { const from = Math.max(0, i - window + 1); const sub = values.slice(from, i + 1); return sub.reduce((a, b) => a + b, 0) / sub.length; });
    },
    weekStart: (epochDay) => epochDay - (((epochDay + 3) % 7) + 7) % 7,
    formatDuration(totalSec) {
      const s = Math.max(0, Math.floor(totalSec));
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
      return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
    },
  };

  // ---------- Supersatz-Gruppen (PlanEditorScreen.kt) ----------
  const SupersetGroups = {
    assign(linkNext) {
      const out = new Array(linkNext.length).fill(0);
      let group = 0, i = 0;
      while (i < linkNext.length) {
        if (linkNext[i] && i + 1 < linkNext.length) {
          group++;
          let j = i;
          while (j < linkNext.length) { out[j] = group; if (!(linkNext[j] && j + 1 < linkNext.length)) break; j++; }
          i = j + 1;
        } else i++;
      }
      return out;
    },
    links: (groups) => groups.map((g2, i) => g2 !== 0 && i + 1 < groups.length && groups[i + 1] === g2),
  };

  /** Nächstes Workout: Plan nach dem zuletzt trainierten innerhalb derselben Kategorie (TodayScreen.kt nextPlan) */
  function nextPlan(plans, sessions) {
    if (!plans.length) return null;
    const done = sessions.filter((s) => s.endedAt != null && s.planId != null);
    if (!done.length) return plans[0];
    const last = done.reduce((a, b) => (b.startedAt > a.startedAt ? b : a));
    const lastPlan = plans.find((p) => p.id === last.planId);
    if (!lastPlan) return plans[0];
    const group = plans.filter((p) => p.category === lastPlan.category);
    return group[(group.indexOf(lastPlan) + 1) % group.length];
  }

  // ---------- Zeit / Kalender ----------
  const epochDayOfDate = (d) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  const todayEpochDay = () => epochDayOfDate(new Date());
  const epochDayOf = (ms) => epochDayOfDate(new Date(ms));
  const dateOfEpochDay = (ep) => { const u = new Date(ep * 86400000); return new Date(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate()); };
  const isoDow = (ep) => (((ep + 3) % 7) + 7) % 7 + 1; // 1 = Montag … 7 = Sonntag

  g.LF = { SetType, OneRepMax, Progression, PlateCalculator, WarmupCalculator, Recovery, RecoveryCalc, Streak, Interval, Units, Stats, SupersetGroups, nextPlan,
    epochDayOf, todayEpochDay, dateOfEpochDay, epochDayOfDate, isoDow, clamp };
})(typeof window !== 'undefined' ? window : globalThis);
