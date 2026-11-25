'use strict';
/* Lumvero Fit – Navigation, Dialoge, Aktionen und Start. */
const $ = (s, r = document) => r.querySelector(s);
const appEl = $('#app'), tabsEl = $('#tabs'), ovEl = $('#ov'), prEl = $('#pr');
const UI = {
  lib: { q: '', muscle: null, equip: null }, pick: { q: '', muscle: null, equip: null }, editor: null, inputs: {},
  ptab: 0, calOffset: 0, selDay: null, selPr: null,
  body: { weight: '', weightErr: '', mkind: SEED.measurementKinds[0], measure: '', measureErr: '' },
  draft: { name: 'Tabata', config: Object.assign({}, PRESETS[0].config) },
};

// ---------------- Navigation (wie NavViewModel) ----------------
const TABS = [['today', 'Heute', 'home'], ['training', 'Training', 'dumbbell'], ['timer', 'Timer', 'timer'], ['body', 'Körper', 'body'], ['progress', 'Fortschritt', 'chart']];
const TAB_IDS = TABS.map((t) => t[0]);
let stack = [{ n: 'today' }], navAnim = 0, pendingRender = false;
const cur = () => stack[stack.length - 1];
function setNav(next, dir) { stack = next; closeOv(); navAnim = dir || 1; render(); }
const go = (r) => setNav([...stack, r], 1);
const back = () => { if (stack.length > 1) setNav(stack.slice(0, -1), -1); };
const replace = (r) => setNav([...stack.slice(0, -1), r], 1);
function tab(n) { const from = TAB_IDS.indexOf(cur().n), to = TAB_IDS.indexOf(n); setNav([{ n }], to >= from ? 2 : -2); }
function navGo(n) { if (TAB_IDS.includes(n)) tab(n); else go({ n }); }

const VIEWS = { today: vToday, training: vTraining, timer: vTimer, body: vBody, progress: vProgress, settings: vSettings, library: vLibrary, workout: vWorkout, plan: vPlanEditor, exercise: vExercise, session: vSession };
function applyTheme() {
  const dark = S.theme === 'DARK' || (S.theme === 'SYSTEM' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const m = $('meta[name=theme-color]'); if (m) m.content = dark ? '#0A0E13' : '#F3F5F9';
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (S.theme === 'SYSTEM') render(); });
function render(soft) {
  const ae = document.activeElement;
  if (soft && ae && appEl.contains(ae) && ae.matches('input,textarea')) { pendingRender = true; return; }
  pendingRender = false;
  applyTheme();
  const y = window.scrollY;
  appEl.innerHTML = (VIEWS[cur().n] || vToday)();
  const isTab = TAB_IDS.includes(cur().n);
  tabsEl.innerHTML = isTab ? TABS.map(([id, label, icn]) => `<button class="${cur().n === id ? 'on' : ''}" data-go="${id}" aria-label="${label}"><i>${ic(icn, 24)}</i>${label}</button>`).join('') : '';
  if (navAnim) {
    appEl.style.setProperty('--dx', (navAnim > 0 ? 1 : -1) * (Math.abs(navAnim) === 1 ? 25 : 10) + 'vw');
    appEl.classList.remove('anim'); void appEl.offsetWidth; appEl.classList.add('anim');
    clearTimeout(render.t); render.t = setTimeout(() => appEl.classList.remove('anim'), 320);
    window.scrollTo(0, 0); navAnim = 0;
  } else window.scrollTo(0, y);
}
function liveUpdate() {
  document.querySelectorAll('[data-live=wo-dur]').forEach((el) => (el.innerHTML = ic('timer', 14) + Stats.formatDuration((now() - Number(el.dataset.start)) / 1000)));
  const t = TM.ui();
  if (t && t.kind === 'REST') {
    const rt = $('[data-live=rest-time]'); if (rt) rt.textContent = Stats.formatDuration(t.state.remainingSec);
    const rb = $('[data-live=rest-bar]'); if (rb) rb.style.width = Math.min(100, (t.state.remainingSec / Math.max(1, t.snapshot.workSec)) * 100) + '%';
  }
  if (cur().n === 'timer') {
    const L = timerLook();
    const ring = $('[data-live=t-ring]'); if (ring) { ring.setAttribute('stroke-dashoffset', (Number(ring.dataset.c) * (1 - Math.min(1, Math.max(0, L.progress)))).toFixed(2)); ring.style.stroke = L.color; }
    const tt = $('[data-live=t-time]'); if (tt && L.r) tt.textContent = Stats.formatDuration(L.st.remainingSec);
    const tp = $('[data-live=t-phase]'); if (tp) { tp.textContent = L.name; tp.style.color = L.color; }
    const tr = $('[data-live=t-round]'); if (tr && L.r) tr.textContent = `Runde ${L.st.round} / ${L.st.config.rounds}`;
    const tb = $('[data-live=t-total]'); if (tb && L.r) tb.style.width = Interval.totalProgress(L.st) * 100 + '%';
  }
}
TM.listeners.push((structural) => {
  const n = cur().n;
  if (structural && (n === 'workout' || n === 'timer')) render(true);
  else if (structural && n === 'today' && !TM.snap) render(true);
  else liveUpdate();
});

// ---------------- Snackbar, Dialoge, Menüs ----------------
function snack(m) { const s = $('#snack'); s.textContent = m; s.classList.add('show'); clearTimeout(snack.t); snack.t = setTimeout(() => s.classList.remove('show'), 2800); }
let OVA = {}, DF = {}, DLG = null;
function closeOv() { ovEl.innerHTML = ''; OVA = {}; DLG = null; }
function dlg(o) {
  DF = o.form || {}; DLG = o; OVA = { 'ov-close': closeOv };
  const prevScroll = ovEl.querySelector('.dlg') ? ovEl.querySelector('.dlg').scrollTop : 0;
  ovEl.innerHTML = `<div class="scrim" data-act="ov-close"></div><div class="dlg" role="dialog">${o.icon ? `<div class="dic">${ic(o.icon, 26)}</div>` : ''}${o.title ? `<h3>${esc(o.title)}</h3>` : ''}<div class="dbody">${o.body || ''}</div>
    <div class="acts">${o.acts.map((a) => `<button data-act="dlg-${a.id}" ${a.disabled ? 'disabled' : ''}>${esc(a.label)}</button>`).join('')}</div></div>`;
  o.acts.forEach((a) => (OVA['dlg-' + a.id] = () => { const r = a.fn && a.fn(); if (r !== false) closeOv(); }));
  Object.assign(OVA, o.extra || {});
  if (o.keepScroll) ovEl.querySelector('.dlg').scrollTop = prevScroll;
}
const setDisabled = (id, dis) => { const b = ovEl.querySelector(`[data-act="dlg-${id}"]`); if (b) b.disabled = dis; };
const info = (text) => dlg({ body: `<p style="color:var(--on)">${esc(text)}</p>`, acts: [{ id: 'ok', label: 'OK' }] });
const confirmDlg = (title, text, okLabel, fn, icon, okId = 'ok') => dlg({ title, icon, body: `<p>${esc(text)}</p>`, acts: [{ id: 'cancel', label: 'Abbrechen' }, { id: okId, label: okLabel, fn }] });
function menu(anchor, items) {
  const r = anchor.getBoundingClientRect();
  OVA = { 'ov-close': closeOv }; DLG = null;
  ovEl.innerHTML = `<div class="scrim" style="background:transparent" data-act="ov-close"></div><div class="menu" style="right:${Math.max(8, innerWidth - r.right)}px;top:${r.bottom}px">${items.map((it) => `<button data-act="m-${it.id}">${ic(it.icon, 20)}${esc(it.label)}</button>`).join('')}</div>`;
  const m = ovEl.querySelector('.menu'), h = m.offsetHeight;
  if (r.bottom + h > innerHeight - 20) m.style.top = Math.max(20, r.top - h) + 'px';
  items.forEach((it) => (OVA['m-' + it.id] = () => { closeOv(); it.fn(); }));
}
function picker(onPick) {
  UI.pick = { q: '', muscle: null, equip: null };
  const draw = () => {
    ovEl.innerHTML = `<div class="scrim" data-act="ov-close"></div><div class="full"><div class="hd"><h3>Übung wählen</h3><button class="tb" data-act="ov-close">Schließen</button></div><div style="padding:0 16px">${searchAndFilter(UI.pick, 'pick', false)}</div><div class="lst" id="pickList">${exList(UI.pick, 'pick')}</div></div>`;
  };
  DLG = null; DF = {};
  OVA = { 'ov-close': closeOv, pickmuscle: (el) => { const v = el.dataset.v || null; UI.pick.muscle = UI.pick.muscle === v ? null : v; draw(); }, pick: (el) => { closeOv(); onPick(Number(el.dataset.id)); } };
  draw();
}
function celebrate(title, detail) {
  prEl.innerHTML = `<canvas></canvas><div class="prc" data-act="pr-close"><div class="tro">${ic('trophy', 38)}</div><h3>${esc(title)}</h3><p>${esc(detail)}</p></div>`;
  ART.confetti(prEl.querySelector('canvas'), now());
  const close = () => { prEl.innerHTML = ''; };
  prEl.onclick = close; clearTimeout(celebrate.t); celebrate.t = setTimeout(close, 2800);
}
function sanitizeNumber(v, decimal) { let out = '', dot = false; for (const ch of String(v).replace(/,/g, '.')) { if (/\d/.test(ch)) out += ch; else if (decimal && ch === '.' && !dot) { dot = true; out += ch; } } return out.slice(0, 9); }
const parseNum = (v) => (v === '' || v === '.' || v == null ? null : Number.isFinite(Number(v)) ? Number(v) : null);
let notifAskedNow = false;
function askNotifOnce() { if (!LN || META.notifAsked || notifAskedNow) return; notifAskedNow = true; META.notifAsked = true; saveMeta(); Notify.ask(); }

// ---------------- Plan-Editor ----------------
function openEditor(planId) {
  if (planId == null) UI.editor = { planId: null, plan: { id: 0, name: 'Mein Plan', description: '', category: 'Eigene', isBuiltIn: false, sortOrder: 0 }, items: [] };
  else {
    const p = byId('plans', planId) || { id: 0, name: 'Mein Plan', description: '', category: 'Eigene', isBuiltIn: false, sortOrder: 0 };
    const items = Q.planItems(planId).filter((i) => byId('exercises', i.exerciseId));
    const links = SupersetGroups.links(items.map((i) => i.supersetGroup));
    UI.editor = { planId, plan: Object.assign({}, p), items: items.map((i, idx) => ({ exId: i.exerciseId, sets: i.targetSets, minReps: i.minReps, maxReps: i.maxReps, rest: i.restSec, linkNext: links[idx] })) };
  }
  go({ n: 'plan', id: planId });
}
function addExerciseDialog() {
  const F = { exName: '', muscle: 'Brust', equip: 'Kurzhantel', pattern: SEED.patternSuggest['Brust'], chosen: false, track: 'WEIGHT_REPS', exSteps: '' };
  const draw = (keep) => dlg({
    title: 'Eigene Übung', form: F, keepScroll: keep,
    body: `${fld('exName', 'Name', F.exName)}<div style="display:flex;justify-content:center;margin:8px 0">${ART.figure({ pattern: F.pattern, equipment: F.equip, muscleGroup: F.muscle }, { cls: 'f120' })}</div>
      <div style="font-weight:600;font-size:14px">Muskelgruppe</div><div class="wrap s" style="margin:6px 0 10px">${SEED.muscles.map((m) => chip(m, F.muscle === m, `data-act="ax-muscle" data-v="${esc(m)}"`)).join('')}</div>
      <div style="font-weight:600;font-size:14px">Gerät</div><div class="wrap s" style="margin:6px 0 10px">${SEED.equips.map((m) => chip(m, F.equip === m, `data-act="ax-equip" data-v="${esc(m)}"`)).join('')}</div>
      <div style="font-weight:600;font-size:14px">Bewegung (Grafik)</div><div class="wrap s" style="margin:6px 0 10px">${SEED.patterns.map((p) => chip(SEED.patternLabels[p], F.pattern === p, `data-act="ax-pattern" data-v="${p}"`)).join('')}</div>
      <div style="font-weight:600;font-size:14px">Erfassung</div><div class="wrap s" style="margin:6px 0 10px">${['WEIGHT_REPS', 'REPS', 'TIME'].map((t) => chip(trackLabel(t), F.track === t, `data-act="ax-track" data-v="${t}"`)).join('')}</div>
      ${fld('exSteps', 'Anleitung (eine Zeile pro Schritt)', F.exSteps, { textarea: true })}`,
    acts: [{ id: 'cancel', label: 'Abbrechen' }, { id: 'save', label: 'Speichern', disabled: !F.exName.trim(), fn: () => {
      insert('exercises', { name: F.exName.trim(), muscleGroup: F.muscle, equipment: F.equip, pattern: F.pattern, trackType: F.track, instructions: F.exSteps.trim(), isCustom: true, seedKey: null }); persist(); render();
    } }],
    onInput: (k) => { if (k === 'exName') setDisabled('save', !F.exName.trim()); },
    extra: {
      'ax-muscle': (el) => { F.muscle = el.dataset.v; if (!F.chosen) F.pattern = SEED.patternSuggest[F.muscle] || 'PUSH_H'; draw(true); },
      'ax-equip': (el) => { F.equip = el.dataset.v; draw(true); },
      'ax-pattern': (el) => { F.pattern = el.dataset.v; F.chosen = true; draw(true); },
      'ax-track': (el) => { F.track = el.dataset.v; draw(true); },
    },
  });
  draw(false);
}

// ---------------- Workout ----------------
const wsid = () => cur().id;
function blockOf(exId) { const W = buildWorkout(wsid()); return W ? W.blocks.find((b) => b.exercise.id === exId) : null; }
function setInput(exId, input) { UI.inputs[wsid() + ':' + exId] = input; render(); }
function withBlock(el, fn) { const b = blockOf(Number(el.dataset.ex)); if (b) fn(b, inputFor(wsid(), b)); }
function logSet(b, input) {
  const sid = wsid(), counts = SetType.countsForStats(input.setType), e = b.exercise;
  const e1rm = OneRepMax.estimate(input.weightKg, input.reps);
  const sw = b.sets.filter((s) => SetType.countsForStats(s.setType));
  const sBest = Math.max(0, ...sw.map((s) => OneRepMax.estimate(s.weightKg, s.reps))), sBestW = Math.max(0, ...sw.map((s) => s.weightKg));
  const weightPr = counts && e.trackType === 'WEIGHT_REPS' && input.reps > 0 && b.bestWeight > 0 && input.weightKg > b.bestWeight && input.weightKg > sBestW;
  const e1rmPr = counts && e.trackType === 'WEIGHT_REPS' && input.weightKg > 0 && b.bestE1rm > 0 && e1rm > b.bestE1rm && e1rm > sBest;
  const repsPr = counts && e.trackType !== 'WEIGHT_REPS' && b.bestReps > 0 && input.reps > b.bestReps && input.reps > Math.max(0, ...sw.map((s) => s.reps));
  R.logSet(sid, e.id, input.weightKg, input.reps, input.rpe, input.setType);
  UI.inputs[sid + ':' + e.id] = Object.assign({}, input, { rpe: null, setType: input.setType === 'WARMUP' ? 'WARMUP' : 'NORMAL' });
  if (weightPr || e1rmPr || repsPr) {
    const detail = [weightPr && `Höchstes Gewicht: ${Units.weight(input.weightKg, S.unit)} × ${input.reps}`, e1rmPr && `Geschätztes 1RM: ${Units.weight(e1rm, S.unit)}`,
      repsPr && (e.trackType === 'TIME' ? `Längste Zeit: ${input.reps} s` : `Meiste Wiederholungen: ${input.reps}`)].filter(Boolean).join('\n');
    const title = 'Neuer Rekord – ' + e.name;
    if (S.prCelebration) celebrate(title, detail); else snack(title + ': ' + detail.replace(/\n/g, ' · '));
    Feedback.signal('FINISH', S.sound, S.vibration);
  }
  const rest = restAfter(b, input.setType);
  if (rest > 0) { askNotifOnce(); TM.startRest(rest, 'Pause nach ' + e.name, sid); }
  render();
}
function plateDialog(weightKg) {
  const u = S.unit, ul = unitL(), bar = barInUnit();
  const F = { plate: Units.number(Units.toDisplay(weightKg, u), 2).replace(',', '.') };
  const out = () => {
    const target = parseNum(F.plate) || 0, r = PlateCalculator.compute(target, bar, u === 'KG' ? PlateCalculator.KG_PLATES : PlateCalculator.LB_PLATES), max = u === 'KG' ? 25 : 45;
    let h = '';
    if (!r.perSide.length) h += `<p style="color:var(--on)">${target <= bar ? 'Nur die leere Stange.' : 'Keine Scheiben nötig.'}</p>`;
    else {
      const col = (p) => (p >= max * 0.99 ? C.coral : p >= max * 0.75 ? C.sky : p >= max * 0.55 ? C.amber : p >= max * 0.35 ? C.mint : C.violet);
      h += `<div style="font-weight:600">Pro Seite:</div><div class="plates" data-test="plates"><span class="bar"></span>${r.perSide.map((p) => `<span class="p" style="height:${34 + 50 * (p / max)}px;background:${col(p)}"></span>`).join('')}<span class="end"></span></div>
        <div class="nums">${r.perSide.map((p) => Units.number(p, 2)).join(' + ')} ${ul}</div>`;
    }
    if (Math.abs(r.remainder) > 0.001 && target > bar) h += `<div style="color:var(--coral);font-size:13px;margin-top:4px">Erreichbar: ${Units.number(r.achievedTotal, 2)} ${ul} (Rest ${Units.number(r.remainder, 2)})</div>`;
    return h;
  };
  dlg({ icon: 'plate', title: 'Scheibenrechner', form: F, body: `${fld('plate', `Zielgewicht (${ul})`, F.plate, { im: 'decimal' })}<div class="t-lab" style="margin:6px 0">Stange: ${Units.number(bar)} ${ul} (änderbar in den Einstellungen)</div><div id="plateOut">${out()}</div>`,
    acts: [{ id: 'close', label: 'Schließen' }], onInput: () => { $('#plateOut').innerHTML = out(); } });
}
function warmupDialog(b, input) {
  const u = S.unit, inc = u === 'KG' ? S.weightIncrementKg : 5, sets = WarmupCalculator.ramp(Units.toDisplay(input.weightKg, u), barInUnit(), inc), logged = new Set();
  const body = () => (sets.length ? '' : '<p style="color:var(--on)">Zuerst ein Arbeitsgewicht über dem Stangengewicht einstellen.</p>') + sets.map((s, i) => `<div class="row" style="min-height:44px">${setBadge('WARMUP', i + 1)}<span class="nums grow">${Units.number(s.weight)} ${unitL()} × ${s.reps}</span>
    ${logged.has(i) ? `<span style="color:var(--primary)" aria-label="erledigt">${ic('check')}</span>` : `<button class="tb" data-act="wu-log" data-i="${i}">Abhaken</button>`}</div>`).join('') + '<div class="t-ls" style="font-weight:500;letter-spacing:.2px;margin-top:6px">Aufwärmsätze zählen nicht für Volumen, Rekorde und 1RM.</div>';
  const draw = () => dlg({ icon: 'flame', title: `Aufwärmen auf ${Units.weight(input.weightKg, u)}`, body: body(), acts: [{ id: 'done', label: 'Fertig' }], keepScroll: true,
    extra: { 'wu-log': (el) => { const i = Number(el.dataset.i), s = sets[i]; R.logSet(wsid(), b.exercise.id, Units.toKg(s.weight, u), s.reps, null, 'WARMUP'); logged.add(i); render(); draw(); } } });
  draw();
}
function noteDialog(title, label, value, max, onSave) {
  const F = { note: value };
  dlg({ title, form: F, body: fld('note', label, value, { textarea: true, ml: max || '' }) + (max ? `<div class="fhint" id="noteCount">${value.length}/${max}</div>` : ''),
    acts: [{ id: 'cancel', label: 'Abbrechen' }, { id: 'save', label: 'Speichern', fn: () => onSave(F.note) }],
    onInput: () => { const c = $('#noteCount'); if (c) c.textContent = `${F.note.length}/${max}`; } });
}
function finishDialog() {
  const W = buildWorkout(wsid()); if (!W) return;
  const total = sum(W.blocks, (b) => b.sets.length), warm = sum(W.blocks, (b) => b.sets.filter((s) => !SetType.countsForStats(s.setType)).length), work = total - warm;
  const what = (work === 1 ? '1 Arbeitssatz' : `${work} Arbeitssätze`) + (warm > 0 ? ` und ${warm} ` + (warm === 1 ? 'Aufwärmsatz' : 'Aufwärmsätze') : '');
  const text = total === 0 ? 'Du hast noch keinen Satz geloggt – das Training wird verworfen.' : `${what} ${total === 1 ? 'wird' : 'werden'} gespeichert. Danach wird automatisch ein lokales Backup angelegt.`;
  dlg({ title: 'Training beenden?', body: `<p>${esc(text)}</p>`, acts: [{ id: 'finish-cancel', label: 'Weiter trainieren' }, { id: 'finish-ok', label: 'Beenden', fn: () => {
    const sid = wsid();
    if (TM.snap && TM.snap.kind === 'REST') TM.stop();
    const saved = R.finishSession(sid);
    if (saved) { autoBackup(); replace({ n: 'session', id: sid }); } else back();
  } }] });
}

// ---------------- Backup ----------------
const isoToday = () => { const d = new Date(); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`; };
async function exportJson() {
  const d = exportData(), text = encodeBackup(d), name = `lumvero-fit-backup-${isoToday()}.json`;
  window.__lastExport = text;
  const msg = `Backup gespeichert: ${d.sessions.length} Trainings, ${d.sets.length} Sätze, ${d.exercises.length} Übungen.`;
  try {
    if (FS && Share) {
      const r = await FS.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' });
      await Share.share({ title: name, url: r.uri, dialogTitle: 'Backup speichern' });
    } else {
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' })); a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }
    info(msg);
  } catch (e) { if (!/cancel/i.test(String(e && e.message))) info('Export fehlgeschlagen: ' + (e && e.message)); }
}
function importText(text) {
  let data;
  try { data = decodeBackup(text); } catch (e) { info(e.message || 'Unbekannter Fehler'); return; }
  dlg({ title: 'Backup importieren?', body: `<p>Das Backup enthält ${data.sessions.length} Trainings, ${data.sets.length} Sätze und ${data.exercises.length} Übungen. Alle aktuellen Daten auf diesem Gerät werden dadurch ersetzt. Tipp: Vorher selbst exportieren.</p>`,
    acts: [{ id: 'cancel', label: 'Abbrechen' }, { id: 'import-ok', label: 'Ersetzen & importieren', fn: () => {
      let m;
      try { importData(data); UI.inputs = {}; TM.stop(); rescheduleReminders(); m = `Import abgeschlossen: ${data.sessions.length} Trainings, ${data.sets.length} Sätze (Backup-Format v${data.version}).`; }
      catch (e) { m = 'Import fehlgeschlagen, bestehende Daten bleiben unverändert: ' + e.message; }
      render(); setTimeout(() => info(m), 0);
    } }] });
}
$('#importFile').addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  const rd = new FileReader(); rd.onload = () => importText(String(rd.result)); rd.onerror = () => info('Datei konnte nicht gelesen werden'); rd.readAsText(f, 'utf-8');
  e.target.value = '';
});

// ---------------- Einstellungen ----------------
const REM_KEYS = ['trainingReminder', 'trainingReminderMinute', 'trainingDays', 'waterReminder', 'waterIntervalMin', 'waterFromMinute', 'waterToMinute', 'waterGoalMl'];
function setS(patch) { Object.assign(S, patch); saveSettings(); if (Object.keys(patch).some((k) => REM_KEYS.includes(k))) rescheduleReminders(); render(); }
function stepSetting(k, d) {
  const up = d > 0, c = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  switch (k) {
    case 'weeklyGoal': return setS({ weeklyGoal: c(S.weeklyGoal + d, 1, 14) });
    case 'defaultRestSec': return setS({ defaultRestSec: c(S.defaultRestSec + d, 0, 600) });
    case 'waterGoalMl': return setS({ waterGoalMl: c(S.waterGoalMl + d, 500, 8000) });
    case 'kcalGoal': return setS({ kcalGoal: c(S.kcalGoal + d, 800, 8000) });
    case 'proteinGoalG': return setS({ proteinGoalG: c(S.proteinGoalG + d, 20, 400) });
    case 'stepGoal': return setS({ stepGoal: c(S.stepGoal + d, 1000, 50000) });
    case 'weightIncrementKg': { const v = S.weightIncrementKg; return setS({ weightIncrementKg: up ? (INC_STEPS.find((x) => x > v) ?? INC_STEPS[INC_STEPS.length - 1]) : ([...INC_STEPS].reverse().find((x) => x < v) ?? INC_STEPS[0]) }); }
    case 'barWeightKg': { const v = S.barWeightKg; return setS({ barWeightKg: up ? (BARS.find((x) => x > v) ?? BARS[BARS.length - 1]) : ([...BARS].reverse().find((x) => x < v) ?? BARS[0]) }); }
    case 'barLbs': { const v = barInUnit(); return setS({ barWeightKg: lbsBarToKg(up ? (BARS_LBS.find((x) => x > v + 0.01) ?? BARS_LBS[BARS_LBS.length - 1]) : ([...BARS_LBS].reverse().find((x) => x < v - 0.01) ?? BARS_LBS[0])) }); }
    default: return null;
  }
}
async function toggleSetting(k) {
  const v = !S[k];
  setS({ [k]: v });
  if (v && (k === 'trainingReminder' || k === 'waterReminder')) {
    if (!LN) return;
    const ok = await Notify.ask();
    if (!ok) info('Mitteilungen sind für Lumvero Fit deaktiviert – Erinnerungen werden geplant, aber nicht angezeigt. Bitte in den iOS-Einstellungen erlauben.');
    rescheduleReminders();
  }
}
function timeDialog(k) {
  const F = { time: hm(S[k]) };
  dlg({ title: 'Uhrzeit wählen', form: F, body: `<div class="fld"><input type="time" data-f="time" value="${F.time}"><label>Uhrzeit</label></div>`,
    acts: [{ id: 'cancel', label: 'Abbrechen' }, { id: 'ok', label: 'OK', fn: () => {
      const m = /^(\d{1,2}):(\d{2})/.exec(F.time || ''); if (!m) return;
      let v = Number(m[1]) * 60 + Number(m[2]);
      if (k === 'waterFromMinute') v = Math.min(v, S.waterToMinute); if (k === 'waterToMinute') v = Math.max(v, S.waterFromMinute);
      setS({ [k]: v });
    } }] });
}

// ---------------- Aktionen ----------------
const today = () => todayEpochDay();
const numOf = (el, k = 'v') => Number(el.dataset[k]);
const ACT = {
  'open-active': () => { const a = Q.active(); if (a) go({ n: 'workout', id: a.id }); },
  'start-next': (el) => ACT['start-plan'](el),
  'start-plan': (el) => { const p = byId('plans', numOf(el, 'id')); if (!p) return; go({ n: 'workout', id: R.startSession(p.id, p.name) }); },
  free: () => go({ n: 'workout', id: R.startSession(null, 'Freies Training') }),
  water: (el) => { R.add('water', { epochDay: today(), ml: numOf(el) }); render(); },
  steps: (el) => { R.add('activity', { epochDay: today(), steps: numOf(el), minutes: 0, label: 'Schritte' }); render(); },
  minutes: (el) => { R.add('activity', { epochDay: today(), steps: 0, minutes: numOf(el), label: 'Aktivität' }); render(); },
  // Training & Pläne
  'edit-plan': (el) => openEditor(numOf(el, 'id')),
  'new-plan': () => openEditor(null),
  'plan-menu': (el) => {
    const id = numOf(el, 'id');
    menu(el, [{ id: 'edit', label: 'Bearbeiten', icon: 'edit', fn: () => openEditor(id) }, { id: 'dup', label: 'Duplizieren', icon: 'plus', fn: () => { R.duplicatePlan(id); render(); } },
      { id: 'del', label: 'Löschen', icon: 'trash', fn: () => { const p = byId('plans', id); if (p) confirmDlg('Plan löschen?', `„${p.name}“ wird entfernt. Bereits geloggte Trainings bleiben erhalten.`, 'Löschen', () => { R.deletePlan(id); render(); }, 'trash'); } }]);
  },
  'pe-step': (el) => {
    const it = UI.editor.items[numOf(el, 'i')], k = el.dataset.k, d = numOf(el, 'd'), e = byId('exercises', it.exId), step = e && e.trackType === 'TIME' ? 5 : 1;
    if (k === 'sets') it.sets = Math.min(20, Math.max(1, it.sets + d));
    else if (k === 'min') { if (d < 0) it.minReps = Math.max(1, it.minReps - step); else { it.minReps += step; it.maxReps = Math.max(it.maxReps, it.minReps); } }
    else if (k === 'max') it.maxReps = d < 0 ? Math.max(it.minReps, it.maxReps - step) : it.maxReps + step;
    else if (k === 'rest') it.rest = Math.min(600, Math.max(0, it.rest + d * 15));
    render();
  },
  'pe-move': (el) => {
    const L = UI.editor.items, i = numOf(el, 'i'), j = i + numOf(el, 'd'); if (j < 0 || j >= L.length) return;
    [L[i], L[j]] = [L[j], L[i]]; L[L.length - 1].linkNext = false; render();
  },
  'pe-del': (el) => { const L = UI.editor.items, i = numOf(el, 'i'); L.splice(i, 1); if (L.length && i === L.length) L[i - 1].linkNext = false; render(); },
  'pe-link': (el) => { const it = UI.editor.items[numOf(el, 'i')]; it.linkNext = !it.linkNext; render(); },
  'pe-add': () => picker((id) => { const e = byId('exercises', id), time = e.trackType === 'TIME'; UI.editor.items.push({ exId: id, sets: 3, minReps: time ? 30 : 8, maxReps: time ? 45 : 12, rest: 90, linkNext: false }); render(); }),
  'pe-save': () => {
    const E = UI.editor; if (!E.items.length) return;
    const groups = SupersetGroups.assign(E.items.map((i) => i.linkNext));
    R.savePlan({ id: E.planId || 0, name: E.plan.name.trim() || 'Mein Plan', description: E.plan.description, category: E.plan.category.trim() || 'Eigene', isBuiltIn: E.plan.isBuiltIn, sortOrder: E.plan.sortOrder },
      E.items.map((it, idx) => ({ exerciseId: it.exId, targetSets: it.sets, minReps: it.minReps, maxReps: Math.max(it.minReps, it.maxReps), restSec: it.rest, supersetGroup: groups[idx] })));
    back();
  },
  // Bibliothek & Übungen
  libmuscle: (el) => { const v = el.dataset.v || null; UI.lib.muscle = UI.lib.muscle === v ? null : v; render(); },
  libequip: (el) => { const v = el.dataset.v || null; UI.lib.equip = UI.lib.equip === v ? null : v; render(); },
  'open-ex': (el) => go({ n: 'exercise', id: numOf(el, 'id') }),
  'add-ex': () => addExerciseDialog(),
  'ex-note': () => { const e = byId('exercises', cur().id); noteDialog('Notiz zur Übung', 'Notiz', e.note, 500, (t) => { e.note = t.trim(); persist(); render(); }); },
  'ex-delete': () => { const e = byId('exercises', cur().id); if (R.deleteCustomExercise(e)) back(); else info('Diese Übung hat bereits geloggte Sätze und kann nicht gelöscht werden.'); },
  // Workout
  finish: () => finishDialog(),
  'wo-menu': (el) => menu(el, [{ id: 'discard', label: 'Training verwerfen', icon: 'trash', fn: () => confirmDlg('Training verwerfen?', 'Alle Sätze dieses Trainings werden gelöscht.', 'Verwerfen', () => {
    if (TM.snap && TM.snap.kind === 'REST') TM.stop(); R.deleteSession(wsid()); back(); }, null, 'discard-ok') }]),
  'rest-minus': () => TM.adjustRest(-15), 'rest-plus': () => TM.adjustRest(15), 'rest-skip': () => TM.skip(),
  'w-minus': (el) => withBlock(el, (b, i) => setInput(b.exercise.id, Object.assign({}, i, { weightKg: stepWeight(i.weightKg, false) }))),
  'w-plus': (el) => withBlock(el, (b, i) => setInput(b.exercise.id, Object.assign({}, i, { weightKg: stepWeight(i.weightKg, true) }))),
  'r-minus': (el) => withBlock(el, (b, i) => setInput(b.exercise.id, Object.assign({}, i, { reps: Math.max(1, i.reps - (b.exercise.trackType === 'TIME' ? 5 : 1)) }))),
  'r-plus': (el) => withBlock(el, (b, i) => setInput(b.exercise.id, Object.assign({}, i, { reps: i.reps + (b.exercise.trackType === 'TIME' ? 5 : 1) }))),
  stype: (el) => withBlock(el, (b, i) => setInput(b.exercise.id, Object.assign({}, i, { setType: el.dataset.v }))),
  rpe: (el) => withBlock(el, (b, i) => { const r = numOf(el); setInput(b.exercise.id, Object.assign({}, i, { rpe: i.rpe === r ? null : r })); }),
  sug: (el) => withBlock(el, (b, i) => setInput(b.exercise.id, Object.assign({}, i, { weightKg: b.suggestion.weight, reps: b.suggestion.reps }))),
  'w-edit': (el) => withBlock(el, (b, i) => {
    const F = { wedit: i.weightKg <= 0 ? '' : Units.number(Units.toDisplay(i.weightKg, S.unit), 2).replace(',', '.') };
    const valid = () => parseNum(F.wedit) != null;
    dlg({ title: 'Gewicht eingeben', form: F, body: fld('wedit', `Gewicht in ${unitL()}`, F.wedit, { im: 'decimal' }), acts: [{ id: 'cancel', label: 'Abbrechen' }, { id: 'ok', label: 'OK', disabled: !valid(), fn: () => {
      const v = parseNum(F.wedit); if (v == null) return false; setInput(b.exercise.id, Object.assign({}, i, { weightKg: Units.toKg(Math.min(2000, Math.max(0, v)), S.unit) }));
    } }], onInput: () => { const ok = valid(), er = ovEl.querySelector('[data-err=wedit]'); setDisabled('ok', !ok); if (er) { er.hidden = ok || !F.wedit; er.textContent = 'Bitte eine Zahl eingeben'; } } });
    setTimeout(() => { const inp = ovEl.querySelector('[data-f=wedit]'); if (inp) inp.focus(); }, 50);
  }),
  cycle: (el) => { const s = byId('sets', numOf(el, 'set')); if (!s) return; s.setType = SetType.ALL[(Math.max(0, SetType.ALL.indexOf(s.setType)) + 1) % SetType.ALL.length]; persist(); render(); },
  'del-set': (el) => { R.remove('sets', numOf(el, 'set')); render(); },
  hold: (el) => withBlock(el, (b, i) => { askNotifOnce(); TM.startRest(i.reps, 'Halten: ' + b.exercise.name, wsid()); }),
  log: (el) => withBlock(el, (b, i) => logSet(b, i)),
  'ex-menu': (el) => withBlock(el, (b, i) => {
    const items = [{ id: 'info', label: 'Anleitung', icon: 'info', fn: () => go({ n: 'exercise', id: b.exercise.id }) },
      { id: 'note', label: 'Notiz', icon: 'note', fn: () => noteDialog('Notiz: ' + b.exercise.name, 'z. B. Sitzhöhe 4, enger Griff', b.exercise.note, 500, (t) => { const e = byId('exercises', b.exercise.id); e.note = t.trim(); persist(); render(); }) }];
    if (b.exercise.trackType === 'WEIGHT_REPS') items.push({ id: 'plates', label: 'Scheibenrechner', icon: 'plate', fn: () => plateDialog(i.weightKg) }, { id: 'warmup', label: 'Aufwärmsätze', icon: 'flame', fn: () => warmupDialog(b, i) });
    menu(el, items);
  }),
  'add-exercise': () => picker((id) => { R.addExerciseToSession(wsid(), id); render(); }),
  // Trainingsdetail
  'open-session': (el) => go({ n: 'session', id: numOf(el, 'id') }),
  'sd-note': () => { const s = byId('sessions', cur().id); noteDialog('Notiz', 'Notiz', s.note, 0, (t) => { s.note = t.trim(); persist(); render(); }); },
  'sd-delete': () => confirmDlg('Training löschen?', 'Alle Sätze dieses Trainings werden dauerhaft gelöscht.', 'Löschen', () => { R.deleteSession(cur().id); back(); }),
  // Timer
  't-start': () => { askNotifOnce(); TM.startInterval(UI.draft.config, UI.draft.name); },
  't-pause': () => TM.pause(), 't-resume': () => TM.resume(), 't-skip': () => TM.skip(), 't-stop': () => TM.stop(),
  preset: (el) => { const p = PRESETS[numOf(el)]; UI.draft = { name: p.name, config: Object.assign({}, p.config) }; render(); },
  cfg: (el) => {
    const c = Interval.sanitized(Object.assign({}, UI.draft.config, { [el.dataset.k]: UI.draft.config[el.dataset.k] + numOf(el, 'd') }));
    UI.draft = { name: PRESETS.some((p) => cfgEq(p.config, c)) ? UI.draft.name : 'Eigenes Intervall', config: c }; render();
  },
  'rest-only': (el) => { askNotifOnce(); TM.startRest(numOf(el), 'Pause'); },
  // Körper
  'save-weight': () => {
    const B = UI.body, v = parseNum(B.weight), kg = v == null ? null : Units.toKg(v, S.unit);
    if (kg == null || kg < 20 || kg > 400) B.weightErr = `Bitte ein Gewicht zwischen ${Units.weight(20, S.unit, 0)} und ${Units.weight(400, S.unit, 0)} eingeben`;
    else { R.add('bodyWeights', { epochDay: today(), weightKg: kg }); B.weight = ''; B.weightErr = ''; }
    render();
  },
  'del-weight': (el) => { R.remove('bodyWeights', numOf(el, 'id')); render(); },
  'm-kind': (el) => { UI.body.mkind = el.dataset.v; render(); },
  'save-measure': () => {
    const B = UI.body, v = parseNum(B.measure), max = B.mkind.endsWith('%') ? 75 : 300;
    if (v == null || v <= 0 || v > max) B.measureErr = `Bitte einen Wert zwischen 0 und ${Units.number(max, 0)} eingeben`;
    else { R.add('measurements', { epochDay: today(), kind: B.mkind, value: v }); B.measure = ''; B.measureErr = ''; }
    render();
  },
  'del-measure': (el) => { R.remove('measurements', numOf(el, 'id')); render(); },
  food: (el) => { const f = FOODS[numOf(el)]; R.add('nutrition', { epochDay: today(), label: f[0], kcal: f[1], proteinG: f[2] }); render(); },
  'food-custom': () => {
    const F = { fLabel: '', fKcal: '', fProt: '' };
    dlg({ title: 'Mahlzeit eintragen', form: F, body: fld('fLabel', 'Bezeichnung (optional)', '') + '<div style="height:10px"></div>' + fld('fKcal', 'Kalorien (kcal)', '', { im: 'numeric' }) + '<div style="height:10px"></div>' + fld('fProt', 'Protein (g)', '', { im: 'decimal' }),
      acts: [{ id: 'cancel', label: 'Abbrechen' }, { id: 'add', label: 'Hinzufügen', fn: () => { const k = parseInt(F.fKcal, 10) || 0, p = parseNum(F.fProt) || 0; if (k > 0 || p > 0) { R.add('nutrition', { epochDay: today(), label: F.fLabel.trim(), kcal: Math.min(20000, k), proteinG: Math.min(1000, p) }); render(); } } }] });
  },
  'del-food': (el) => { R.remove('nutrition', numOf(el, 'id')); render(); },
  'del-water': (el) => { R.remove('water', numOf(el, 'id')); render(); },
  'act-custom': () => {
    const F = { aLabel: '', aSteps: '', aMin: '' };
    dlg({ title: 'Aktivität eintragen', form: F, body: fld('aLabel', 'Art (z. B. Laufen)', '') + '<div style="height:10px"></div>' + fld('aSteps', 'Schritte', '', { im: 'numeric' }) + '<div style="height:10px"></div>' + fld('aMin', 'Minuten', '', { im: 'numeric' }),
      acts: [{ id: 'cancel', label: 'Abbrechen' }, { id: 'add', label: 'Hinzufügen', fn: () => { const s = parseInt(F.aSteps, 10) || 0, m = parseInt(F.aMin, 10) || 0; if (s > 0 || m > 0) { R.add('activity', { epochDay: today(), steps: Math.min(200000, s), minutes: Math.min(1440, m), label: F.aLabel.trim() }); render(); } } }] });
  },
  'del-act': (el) => { R.remove('activity', numOf(el, 'id')); render(); },
  // Fortschritt
  ptab: (el) => { UI.ptab = numOf(el); render(); },
  'cal-prev': () => { UI.calOffset--; render(); },
  'cal-next': () => { if (UI.calOffset < 0) { UI.calOffset++; render(); } },
  'cal-day': (el) => { const d = numOf(el); UI.selDay = UI.selDay === d ? null : d; render(); },
  'pr-sel': (el) => { const id = numOf(el, 'id'); UI.selPr = UI.selPr === id ? null : id; render(); },
  // Einstellungen
  set: (el) => setS({ [el.dataset.k]: el.dataset.num ? Number(el.dataset.v) : el.dataset.v }),
  'set-step': (el) => stepSetting(el.dataset.k, numOf(el, 'd')),
  toggle: (el) => toggleSetting(el.dataset.k),
  'rem-day': (el) => { const d = numOf(el); setS({ trainingDays: S.trainingDays.includes(d) ? S.trainingDays.filter((x) => x !== d) : [...S.trainingDays, d].sort((a, b) => a - b) }); },
  time: (el) => timeDialog(el.dataset.k),
  'test-feedback': () => { Feedback.signal('TICK', S.sound, S.vibration); setTimeout(() => Feedback.signal('PHASE', S.sound, S.vibration), 600); setTimeout(() => Feedback.signal('FINISH', S.sound, S.vibration), 1500); },
  export: () => exportJson(),
  import: () => $('#importFile').click(),
};

// ---------------- Ereignisse ----------------
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act],[data-go],[data-back]');
  if (!el || el.disabled) return;
  if (el.hasAttribute('data-back')) return back();
  if (el.dataset.go) { if (ovEl.contains(el)) closeOv(); return navGo(el.dataset.go); }
  const a = el.dataset.act;
  const h = (ovEl.contains(el) && OVA[a]) || ACT[a] || OVA[a];
  if (h) { e.preventDefault(); h(el, e); }
});
document.addEventListener('input', (e) => {
  const el = e.target, k = el.dataset && el.dataset.f; if (!k) return;
  const numeric = { weight: 1, measure: 1, plate: 1, wedit: 1, fProt: 1, fKcal: 0, aSteps: 0, aMin: 0 };
  if (k in numeric) { const v = sanitizeNumber(el.value, !!numeric[k]); if (v !== el.value) el.value = v; }
  if (ovEl.contains(el)) {
    if (k === 'pickq') { UI.pick.q = el.value; $('#pickList').innerHTML = exList(UI.pick, 'pick'); return; }
    DF[k] = el.value; if (DLG && DLG.onInput) DLG.onInput(k, el.value); return;
  }
  const clearErr = (key, prop) => { UI.body[prop] = ''; const f = el.closest('.fld'); if (f) f.classList.remove('err'); const er = $(`[data-err=${key}]`); if (er) er.hidden = true; };
  switch (k) {
    case 'planName': UI.editor.plan.name = el.value; { const er = $('[data-err=planName]'), blank = !el.value.trim(); if (er) { er.hidden = !blank; er.textContent = 'Leer = „Mein Plan“'; } el.closest('.fld').classList.toggle('err', blank); } break;
    case 'planDesc': UI.editor.plan.description = el.value; break;
    case 'planCat': UI.editor.plan.category = el.value; break;
    case 'libq': UI.lib.q = el.value; $('#libList').innerHTML = exList(UI.lib, 'open-ex'); break;
    case 'weight': UI.body.weight = el.value; clearErr('weight', 'weightErr'); break;
    case 'measure': UI.body.measure = el.value; clearErr('measure', 'measureErr'); break;
    default: break;
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || !e.target.dataset) return;
  const k = e.target.dataset.f;
  if (k === 'weight') ACT['save-weight'](); else if (k === 'measure') ACT['save-measure']();
});
document.addEventListener('focusout', () => setTimeout(() => { if (pendingRender && !(document.activeElement && document.activeElement.matches && document.activeElement.matches('input,textarea'))) render(); }, 0));
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { TM.restore(); render(true); } });

// ---------------- Start ----------------
ensureSeeded();
applyTheme();
TM.restore();
render();
setInterval(liveUpdate, 1000);
if (LN) rescheduleReminders();
window.LFApp = { exportData, encodeBackup, decodeBackup, importData, importText, exportJson, render, TM, get db() { return db; }, get S() { return S; }, get stack() { return stack; } };
