'use strict';
/* Lumvero Fit – Datenhaltung (localStorage, Struktur wie die Room-Tabellen), Einstellungen, Backup (kompatibel zu Backup.kt),
   app-weiter Timer (wie TimerController.kt, zeitstempelbasiert), Ton/Haptik, lokale Benachrichtigungen. */
const VERSION = '1.0.1';
const { SetType, OneRepMax, Progression, PlateCalculator, WarmupCalculator, RecoveryCalc, Streak, Interval, Units, Stats, SupersetGroups, nextPlan,
  epochDayOf, todayEpochDay, dateOfEpochDay, isoDow, clamp } = LF;

// ---------------- Plattform / Plugins (mit Browser-Fallback) ----------------
const Cap = window.Capacitor;
const native = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
const plug = (n) => { if (!native) return null; try { return (Cap.Plugins && Cap.Plugins[n]) || (Cap.registerPlugin ? Cap.registerPlugin(n) : null); } catch (e) { return null; } };
const Haptics = plug('Haptics'), LN = plug('LocalNotifications'), FS = plug('Filesystem'), Share = plug('Share'), KeepAwake = plug('KeepAwake');
const safe = (fn) => { try { const r = fn(); return r && r.catch ? r.catch(() => null) : Promise.resolve(r); } catch (e) { return Promise.resolve(null); } };

// ---------------- Tabellen ----------------
const TABLES = ['exercises', 'plans', 'planExercises', 'sessions', 'sets', 'bodyWeights', 'measurements', 'nutrition', 'water', 'activity', 'stepCounts'];
const SHAPES = {
  exercises: { id: 0, name: '', muscleGroup: '', equipment: '', pattern: '', trackType: 'WEIGHT_REPS', instructions: '', isCustom: false, seedKey: null, note: '' },
  plans: { id: 0, name: '', description: '', category: 'Eigene', isBuiltIn: false, sortOrder: 0 },
  planExercises: { id: 0, planId: 0, exerciseId: 0, position: 0, targetSets: 3, minReps: 8, maxReps: 12, restSec: 90, supersetGroup: 0 },
  sessions: { id: 0, planId: null, name: '', startedAt: 0, endedAt: null, note: '', extraExerciseIds: '' },
  sets: { id: 0, sessionId: 0, exerciseId: 0, setIndex: 0, weightKg: 0, reps: 0, rpe: null, note: '', createdAt: 0, setType: 'NORMAL' },
  bodyWeights: { id: 0, epochDay: 0, weightKg: 0, createdAt: 0 },
  measurements: { id: 0, epochDay: 0, kind: '', value: 0, createdAt: 0 },
  nutrition: { id: 0, epochDay: 0, label: '', kcal: 0, proteinG: 0, createdAt: 0 },
  water: { id: 0, epochDay: 0, ml: 0, createdAt: 0 },
  activity: { id: 0, epochDay: 0, steps: 0, minutes: 0, label: '', createdAt: 0 },
  stepCounts: { epochDay: 0, steps: 0, updatedAt: 0 },
};
/** Pflichtfelder ohne Standardwert (wie in Entities.kt) – fehlen sie, ist die Datei ungültig. */
const REQUIRED = {
  exercises: ['name', 'muscleGroup', 'equipment', 'pattern'], plans: ['name'], planExercises: ['planId', 'exerciseId', 'position'],
  sessions: ['name', 'startedAt'], sets: ['sessionId', 'exerciseId', 'setIndex', 'weightKg', 'reps', 'createdAt'], bodyWeights: ['epochDay', 'weightKg', 'createdAt'],
  measurements: ['epochDay', 'kind', 'value', 'createdAt'], nutrition: ['epochDay', 'createdAt'], water: ['epochDay', 'ml', 'createdAt'], activity: ['epochDay', 'createdAt'], stepCounts: ['epochDay', 'steps', 'updatedAt'],
};
function shape(t, o) {
  const s = SHAPES[t], r = {};
  for (const k in s) {
    let v = o[k] === undefined ? s[k] : o[k];
    const def = s[k];
    if (v !== null && def !== null && typeof def !== typeof v) throw new Error(`Feld ${t}.${k} hat den falschen Typ`);
    if (v === null && def !== null) throw new Error(`Feld ${t}.${k} darf nicht leer sein`);
    r[k] = v;
  }
  return r;
}

const DEFAULT_SETTINGS = {
  unit: 'KG', theme: 'DARK', weeklyGoal: 3, waterGoalMl: 2500, kcalGoal: 2200, proteinGoalG: 140, stepGoal: 8000, defaultRestSec: 90, autoRest: true, sound: true, vibration: true,
  weightIncrementKg: 2.5, trainingReminder: false, trainingReminderMinute: 18 * 60, trainingDays: [1, 3, 5], waterReminder: false, waterIntervalMin: 120, waterFromMinute: 9 * 60,
  waterToMinute: 21 * 60, stepSensor: true, autoBackup: true, autoBackupTreeUri: null, prCelebration: true, barWeightKg: 20.0,
};
const mergeSettings = (o) => { const r = Object.assign({}, DEFAULT_SETTINGS); if (o && typeof o === 'object') for (const k in DEFAULT_SETTINGS) if (o[k] !== undefined && (o[k] === null || DEFAULT_SETTINGS[k] === null || typeof o[k] === typeof DEFAULT_SETTINGS[k])) r[k] = o[k]; return r; };

const KEY_DB = 'lumvero-fit.db', KEY_SET = 'lumvero-fit.settings', KEY_TIMER = 'lumvero-fit.timer', KEY_META = 'lumvero-fit.meta', KEY_AUTO = 'lumvero-fit.autobackup';
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
const lsSet = (k, v) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };

let db = lsGet(KEY_DB);
if (!db || !Array.isArray(db.exercises)) db = null;
let S = mergeSettings(lsGet(KEY_SET));
let META = Object.assign({ lastAutoBackupAt: 0, lastAutoBackupInfo: '', notifAsked: false }, lsGet(KEY_META) || {});

function emptyDb() { const d = { seq: {} }; TABLES.forEach((t) => (d[t] = [])); return d; }
function persist() { if (!lsSet(KEY_DB, db)) snack('Speichern fehlgeschlagen – Gerätespeicher voll?'); }
function saveSettings() { lsSet(KEY_SET, S); }
function saveMeta() { lsSet(KEY_META, META); }
const now = () => Date.now();
function insert(t, obj) {
  const seq = db.seq[t] || Math.max(0, ...db[t].map((r) => r.id || 0));
  const row = shape(t, Object.assign({}, obj, { id: seq + 1 }));
  db.seq[t] = seq + 1;
  db[t].push(row);
  return row.id;
}
const byId = (t, id) => db[t].find((r) => r.id === id) || null;
const del = (t, pred) => { db[t] = db[t].filter((r) => !pred(r)); };

function ensureSeeded() {
  if (db && db.exercises.length) return;
  db = emptyDb();
  for (const e of SEED.exercises) insert('exercises', { name: e.name, muscleGroup: e.muscleGroup, equipment: e.equipment, pattern: e.pattern, trackType: e.trackType, instructions: e.instructions, seedKey: e.key });
  const byKey = {}; db.exercises.forEach((e) => (byKey[e.seedKey] = e));
  [...SEED.plans, ...SEED.programs].forEach((p, idx) => {
    const planId = insert('plans', { name: p.name, description: p.description, category: p.category, isBuiltIn: true, sortOrder: idx });
    p.items.forEach((it, pos) => { const ex = byKey[it.key]; if (ex) insert('planExercises', { planId, exerciseId: ex.id, position: pos, targetSets: it.sets, minReps: it.minReps, maxReps: it.maxReps, restSec: it.rest, supersetGroup: it.superset }); });
  });
  persist();
}

// ---------------- Abfragen (wie Daos.kt / FitRepository.kt) ----------------
const Q = {
  exercisesSorted: () => [...db.exercises].sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' })),
  plansSorted: () => [...db.plans].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
  planItems: (planId) => db.planExercises.filter((i) => i.planId === planId).sort((a, b) => a.position - b.position),
  active: () => db.sessions.filter((s) => s.endedAt == null).sort((a, b) => b.startedAt - a.startedAt)[0] || null,
  setsOf: (sessionId) => db.sets.filter((s) => s.sessionId === sessionId),
  exMap: () => { const m = new Map(); db.exercises.forEach((e) => m.set(e.id, e)); return m; },
  lastSessionSets(exerciseId, excludeSessionId) {
    let best = null;
    for (const s of db.sets) {
      if (s.exerciseId !== exerciseId || s.sessionId === excludeSessionId) continue;
      const w = byId('sessions', s.sessionId); if (!w) continue;
      if (!best || w.startedAt > best.startedAt) best = w;
    }
    if (!best) return [];
    return db.sets.filter((s) => s.exerciseId === exerciseId && s.sessionId === best.id).sort((a, b) => a.setIndex - b.setIndex);
  },
  maxSortOrder: () => Math.max(0, ...db.plans.map((p) => p.sortOrder)),
  parseIds: (csv) => String(csv || '').split(',').map((x) => x.trim()).filter((x) => /^-?\d+$/.test(x)).map(Number),
};
const R = {
  startSession(planId, name) { const a = Q.active(); if (a) return a.id; const id = insert('sessions', { planId, name, startedAt: now() }); persist(); return id; },
  finishSession(id) {
    if (!Q.setsOf(id).length) { R.deleteSession(id); return false; }
    const s = byId('sessions', id); if (s) s.endedAt = now(); persist(); return true;
  },
  deleteSession(id) { del('sets', (x) => x.sessionId === id); del('sessions', (x) => x.id === id); persist(); },
  logSet(sessionId, exerciseId, weightKg, reps, rpe, setType = 'NORMAL') {
    const idx = Math.max(0, ...db.sets.filter((s) => s.sessionId === sessionId && s.exerciseId === exerciseId).map((s) => s.setIndex)) + 1;
    const id = insert('sets', { sessionId, exerciseId, setIndex: idx, weightKg, reps, rpe, note: '', createdAt: now(), setType }); persist(); return id;
  },
  savePlan(plan, items) {
    let id = plan.id;
    if (!id) id = insert('plans', Object.assign({}, plan, { id: undefined, sortOrder: Q.maxSortOrder() + 1 }));
    else { const p = byId('plans', id); Object.assign(p, plan); }
    del('planExercises', (i) => i.planId === id);
    items.forEach((it, idx) => insert('planExercises', Object.assign({}, it, { planId: id, position: idx })));
    persist(); return id;
  },
  deletePlan(id) { del('planExercises', (i) => i.planId === id); del('plans', (p) => p.id === id); persist(); },
  duplicatePlan(id) { const p = byId('plans', id); if (!p) return null; return R.savePlan({ name: p.name + ' (Kopie)', description: p.description, category: 'Eigene', isBuiltIn: false, sortOrder: 0 }, Q.planItems(id).map((i) => ({ exerciseId: i.exerciseId, targetSets: i.targetSets, minReps: i.minReps, maxReps: i.maxReps, restSec: i.restSec, supersetGroup: i.supersetGroup }))); },
  addExerciseToSession(sid, exId) { const s = byId('sessions', sid); if (!s) return; const ids = Q.parseIds(s.extraExerciseIds); if (ids.includes(exId)) return; s.extraExerciseIds = [...ids, exId].join(','); persist(); },
  deleteCustomExercise(e) {
    if (!e.isCustom || db.sets.some((s) => s.exerciseId === e.id)) return false;
    del('planExercises', (i) => i.exerciseId === e.id); del('exercises', (x) => x.id === e.id); persist(); return true;
  },
  add(t, obj) { const id = insert(t, Object.assign({ createdAt: now() }, obj)); persist(); return id; },
  remove(t, id) { del(t, (r) => r.id === id); persist(); },
};

// ---------------- Backup (Backup.kt) ----------------
const BACKUP_FORMAT = 'lumvero-fit-backup', BACKUP_VERSION = 2;
function exportData() {
  const d = { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: now(), app: 'Lumvero Fit', settings: S };
  TABLES.forEach((t) => (d[t] = db[t].map((r) => shape(t, r))));
  return d;
}
const encodeBackup = (d) => JSON.stringify(d, null, 4);
function validateBackup(data) {
  const problems = [];
  const exIds = new Set(data.exercises.map((e) => e.id)), planIds = new Set(data.plans.map((p) => p.id)), sesIds = new Set(data.sessions.map((s) => s.id));
  if (exIds.size !== data.exercises.length) problems.push('Doppelte Übungs-IDs im Backup');
  const pe = data.planExercises.find((i) => !planIds.has(i.planId) || !exIds.has(i.exerciseId));
  if (pe) problems.push(`Planeintrag ${pe.id} verweist auf fehlenden Plan oder fehlende Übung`);
  const st = data.sets.find((s) => !sesIds.has(s.sessionId) || !exIds.has(s.exerciseId));
  if (st) problems.push(`Satz ${st.id} verweist auf fehlendes Training oder fehlende Übung`);
  return problems;
}
function decodeBackup(text) {
  let data;
  try {
    const raw = JSON.parse(text);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('kein JSON-Objekt');
    data = { format: raw.format === undefined ? BACKUP_FORMAT : raw.format, version: raw.version === undefined ? BACKUP_VERSION : raw.version, exportedAt: raw.exportedAt || 0, app: raw.app || 'Lumvero Fit',
      settings: raw.settings == null ? null : mergeSettings(raw.settings) };
    if (typeof data.version !== 'number' || typeof data.format !== 'string') throw new Error('format/version');
    for (const t of TABLES) {
      const list = raw[t] === undefined ? [] : raw[t];
      if (!Array.isArray(list)) throw new Error(t + ' ist keine Liste');
      data[t] = list.map((r) => { if (!r || typeof r !== 'object') throw new Error('Eintrag in ' + t); for (const k of REQUIRED[t]) if (r[k] === undefined) throw new Error(`Feld ${t}.${k} fehlt`); return shape(t, r); });
    }
  } catch (e) { throw new Error('Datei ist kein gültiges Lumvero-Fit-Backup (' + String(e.message).slice(0, 120) + ')'); }
  if (data.format !== BACKUP_FORMAT) throw new Error('Unbekanntes Format: ' + data.format);
  if (data.version > BACKUP_VERSION) throw new Error(`Backup stammt aus einer neueren App-Version (${data.version})`);
  const problems = validateBackup(data);
  if (problems.length) throw new Error(problems[0]);
  return data;
}
function importData(data) {
  const next = emptyDb();
  TABLES.forEach((t) => { next[t] = data[t].map((r) => Object.assign({}, r)); if (t !== 'stepCounts') next.seq[t] = Math.max(0, ...next[t].map((r) => r.id)); });
  db = next; persist();
  if (data.settings) { S = mergeSettings(Object.assign({}, data.settings, { autoBackupTreeUri: S.autoBackupTreeUri })); saveSettings(); }
}
/** Lokales Auto-Backup (App-Speicher, die neuesten 3) – ersetzt den Android-Backup-Ordner. */
function autoBackup() {
  if (!S.autoBackup) return;
  const d = exportData(), text = JSON.stringify(d);
  const list = (lsGet(KEY_AUTO) || []).slice(-2);
  list.push({ at: d.exportedAt, text });
  if (!lsSet(KEY_AUTO, list)) lsSet(KEY_AUTO, [{ at: d.exportedAt, text }]);
  META.lastAutoBackupAt = d.exportedAt; META.lastAutoBackupInfo = `${d.sessions.length} Trainings, ${d.sets.length} Sätze`; saveMeta();
  if (FS) safe(() => FS.writeFile({ path: 'lumvero-fit-auto-backup.json', data: encodeBackup(d), directory: 'DOCUMENTS', encoding: 'utf8' }));
}

// ---------------- Ton & Haptik (Feedback.kt) ----------------
let audio = null;
function audioCtx() { try { if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === 'suspended') audio.resume(); } catch (e) { audio = null; } return audio; }
document.addEventListener('pointerdown', () => { if (S.sound) audioCtx(); }, { passive: true });
function beep(freq, ms, at = 0, vol = 0.25) {
  const a = audioCtx(); if (!a) return;
  const o = a.createOscillator(), g2 = a.createGain(), t = a.currentTime + at;
  o.type = 'sine'; o.frequency.value = freq; o.connect(g2); g2.connect(a.destination);
  g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(vol, t + 0.01); g2.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
  o.start(t); o.stop(t + ms / 1000 + 0.02);
}
const Feedback = {
  signal(kind, sound, vibrate) {
    if (sound) {
      if (kind === 'TICK') beep(880, 120);
      else if (kind === 'PHASE') { beep(1046, 150); beep(1318, 150, 0.17); }
      else { beep(784, 220); beep(988, 220, 0.24); beep(1318, 320, 0.48); }
    }
    if (vibrate) {
      const ms = kind === 'TICK' ? 60 : kind === 'PHASE' ? 300 : 700;
      if (Haptics) safe(() => (kind === 'TICK' ? Haptics.impact({ style: 'LIGHT' }) : Haptics.vibrate({ duration: ms })));
      else if (navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) {} }
    }
  },
};

// ---------------- Lokale Benachrichtigungen ----------------
const Notify = {
  async ask() {
    if (!LN) return false;
    const r = await safe(() => LN.requestPermissions());
    return !!(r && r.display === 'granted');
  },
  schedule(list) { if (LN && list.length) safe(() => LN.schedule({ notifications: list })); },
  cancel(ids) { if (LN && ids.length) safe(() => LN.cancel({ notifications: ids.map((id) => ({ id })) })); },
};
const ID_TIMER_DONE = 7701;
function rescheduleReminders() {
  if (!LN) return;
  const ids = []; for (let d = 1; d <= 7; d++) ids.push(8000 + d); for (let i = 0; i < 48; i++) ids.push(8100 + i);
  Notify.cancel(ids);
  const list = [];
  if (S.trainingReminder) for (const d of S.trainingDays) list.push({ id: 8000 + d, title: 'Zeit fürs Training', body: 'Dein nächstes Workout wartet – schon 20 Minuten zählen.',
    schedule: { on: { weekday: (d % 7) + 1, hour: Math.floor(S.trainingReminderMinute / 60), minute: S.trainingReminderMinute % 60 }, allowWhileIdle: true } });
  if (S.waterReminder) { let i = 0; for (let m = S.waterFromMinute; m <= S.waterToMinute && i < 48; m += Math.max(15, S.waterIntervalMin), i++)
    list.push({ id: 8100 + i, title: 'Trinken nicht vergessen', body: `Tagesziel: ${S.waterGoalMl} ml.`, schedule: { on: { hour: Math.floor(m / 60), minute: m % 60 }, allowWhileIdle: true } }); }
  Notify.schedule(list);
}
/** Schedules.kt: nächster Erinnerungszeitpunkt (für die Anzeige auf „Heute“) */
function nextTrainingAt() {
  if (!S.trainingReminder || !S.trainingDays.length) return null;
  const m = clamp(S.trainingReminderMinute, 0, 1439), n = new Date();
  for (let i = 0; i <= 7; i++) { const d = new Date(n.getFullYear(), n.getMonth(), n.getDate() + i, Math.floor(m / 60), m % 60); const dow = d.getDay() === 0 ? 7 : d.getDay(); if (S.trainingDays.includes(dow) && d > n) return d; }
  return null;
}
function nextWaterAt() {
  if (!S.waterReminder) return null;
  const n = new Date(), iv = Math.max(15, S.waterIntervalMin);
  for (let off = 0; off <= 1; off++) for (let m = S.waterFromMinute; m <= S.waterToMinute; m += iv) { const d = new Date(n.getFullYear(), n.getMonth(), n.getDate() + off, 0, m); if (d > n) return d; }
  return new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 0, S.waterFromMinute);
}

// ---------------- App-weiter Timer (TimerController.kt) ----------------
const TM = {
  snap: lsGet(KEY_TIMER), lastKey: null, lastTick: -1, loop: null, listeners: [],
  cfg: (s) => Interval.sanitized({ prepareSec: s.prepareSec, workSec: s.workSec, restSec: s.restSec, rounds: s.rounds }),
  elapsedMs: (s, t) => Math.max(0, (s.pausedAt != null ? s.pausedAt : t) - s.startedAt),
  state(s, t = now()) { return Interval.stateAt(TM.cfg(s), Math.floor(TM.elapsedMs(s, t) / 1000)); },
  endAt: (s) => s.startedAt + Interval.totalSec(TM.cfg(s)) * 1000,
  persist(s) { TM.snap = s; lsSet(KEY_TIMER, s); },
  startRest(sec, label = 'Satzpause', sessionId = null) { if (sec <= 0) return; TM.begin({ id: now(), kind: 'REST', label, prepareSec: 0, workSec: sec, restSec: 0, rounds: 1, startedAt: now(), pausedAt: null, sessionId }); },
  startInterval(config, label) { const c = Interval.sanitized(config); TM.begin({ id: now(), kind: 'INTERVAL', label, prepareSec: c.prepareSec, workSec: c.workSec, restSec: c.restSec, rounds: c.rounds, startedAt: now(), pausedAt: null, sessionId: null }); },
  begin(s) { TM.persist(s); TM.lastKey = null; TM.lastTick = -1; TM.alarm(s); TM.ensureLoop(); TM.awake(true); TM.changed(true); },
  pause() { const s = TM.snap; if (!s || s.pausedAt != null) return; TM.persist(Object.assign({}, s, { pausedAt: now() })); TM.cancelAlarm(); TM.awake(false); TM.changed(true); },
  resume() { const s = TM.snap; if (!s || s.pausedAt == null) return; const n = Object.assign({}, s, { startedAt: s.startedAt + (now() - s.pausedAt), pausedAt: null }); TM.persist(n); TM.alarm(n); TM.ensureLoop(); TM.awake(true); TM.changed(true); },
  adjustRest(delta) {
    const s = TM.snap; if (!s || s.kind !== 'REST') return;
    const elapsed = Math.floor(TM.elapsedMs(s, now()) / 1000);
    const n = Object.assign({}, s, { workSec: Math.min(3600, Math.max(elapsed + 1, s.workSec + delta)) });
    TM.persist(n); TM.cancelAlarm(); if (n.pausedAt == null) TM.alarm(n); TM.lastTick = -1; TM.changed(false);
  },
  skip() {
    const s = TM.snap; if (!s) return;
    if (s.kind === 'REST') { TM.stop(); return; }
    const t = now(), st = TM.state(s, t);
    if (st.phase === 'DONE') { TM.finish(false); return; }
    const shift = st.remainingSec * 1000 - (TM.elapsedMs(s, t) % 1000);
    const n = Object.assign({}, s, { startedAt: s.startedAt - shift });
    TM.persist(n); TM.cancelAlarm(); if (n.pausedAt == null) TM.alarm(n); TM.tickOnce();
  },
  stop() { TM.persist(null); TM.cancelAlarm(); clearInterval(TM.loop); TM.loop = null; TM.awake(false); TM.changed(true); },
  restore() {
    const s = TM.snap; if (!s) return;
    const st = TM.state(s);
    if (st.phase === 'DONE' && s.pausedAt == null) { TM.finish(now() - TM.endAt(s) < 60000); return; }
    TM.lastKey = st.phase + '-' + st.round; if (s.pausedAt == null) { TM.ensureLoop(); TM.awake(true); }
  },
  ensureLoop() { if (TM.loop) return; TM.loop = setInterval(() => { if (TM.tickOnce()) { clearInterval(TM.loop); TM.loop = null; } }, 200); },
  tickOnce() {
    const s = TM.snap; if (!s) return true;
    const st = TM.state(s), key = st.phase + '-' + st.round;
    if (st.phase === 'DONE') { if (s.pausedAt == null) TM.finish(true); return true; }
    let phaseChanged = false;
    if (TM.lastKey != null && key !== TM.lastKey && s.pausedAt == null) { Feedback.signal('PHASE', S.sound, S.vibration); TM.lastKey = key; phaseChanged = true; }
    else if (TM.lastKey == null) TM.lastKey = key;
    if (s.pausedAt == null && st.remainingSec >= 1 && st.remainingSec <= 3 && st.remainingSec !== TM.lastTick) { TM.lastTick = st.remainingSec; Feedback.signal('TICK', S.sound, false); }
    TM.changed(false); // Phasenwechsel: nur Live-Werte aktualisieren (Farbe, Ring, Text), keine Neuzeichnung
    return false;
  },
  finish(signal) {
    const s = TM.snap; if (!s) return;
    TM.persist(null); TM.cancelAlarm(); clearInterval(TM.loop); TM.loop = null; TM.awake(false);
    if (signal) { Feedback.signal('FINISH', S.sound, S.vibration); snack(s.kind === 'REST' ? 'Pause vorbei – weiter mit dem nächsten Satz.' : `${s.label} fertig – gut gemacht!`); }
    TM.changed(true);
  },
  ui() { const s = TM.snap; if (!s) return null; const t = now(); return { snapshot: s, state: TM.state(s, t), kind: s.kind, paused: s.pausedAt != null }; },
  alarm(s) {
    TM.cancelAlarm();
    if (!LN || s.pausedAt != null) return;
    const title = s.kind === 'REST' ? 'Pause vorbei' : `${s.label} fertig`, body = s.kind === 'REST' ? 'Weiter mit dem nächsten Satz.' : 'Gut gemacht – Intervall abgeschlossen.';
    Notify.schedule([{ id: ID_TIMER_DONE, title, body, schedule: { at: new Date(TM.endAt(s)), allowWhileIdle: true } }]);
  },
  cancelAlarm() { Notify.cancel([ID_TIMER_DONE]); },
  awake(on) { if (KeepAwake) safe(() => (on ? KeepAwake.keepAwake() : KeepAwake.allowSleep())); },
  changed(structural) { TM.listeners.forEach((f) => f(structural)); },
};
