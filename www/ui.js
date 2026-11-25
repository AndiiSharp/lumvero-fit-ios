'use strict';
/* Lumvero Fit – Bildschirme (HTML-Erzeugung). Aufbau, Texte und Reihenfolge wie die Compose-Screens der Android-App. */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ic = ART.icon;
const C = { mint: 'var(--primary)', violet: 'var(--secondary)', amber: 'var(--amber)', coral: 'var(--coral)', sky: 'var(--sky)', muted: 'var(--muted)' };
const pill = (text, color = C.mint, iconName = null, extra = '') => `<span class="pill" style="--ac:${color}" ${extra}>${iconName ? ic(iconName, 14) : ''}${esc(text)}</span>`;
const badge = (name, color, size = 36) => `<span class="badge" style="--ac:${color};width:${size}px;height:${size}px">${ic(name, Math.round(size * 0.55))}</span>`;
const sect = (text, action = '') => `<div class="sect"><span>${esc(text)}</span>${action}</div>`;
const card = (inner, o = {}) => `<div class="card ${o.attrs && /data-(act|go)/.test(o.attrs) ? 'click' : ''} ${o.accent ? 'acc' : ''} ${o.cls || ''}" ${o.accent ? `style="--ac:${o.accent}"` : ''} ${o.attrs || ''}>${inner}</div>`;
const chip = (label, on, attrs, disabled = false) => `<button class="chip ${on ? 'on' : ''}" ${attrs} ${disabled ? 'disabled' : ''}>${esc(label)}</button>`;
const swRow = (label, on, attrs) => `<button class="sw ${on ? 'on' : ''}" ${attrs} role="switch" aria-checked="${on}"><span>${esc(label)}</span><i></i></button>`;
const stepper = (label, value, minus, plus, valueAttrs = '', small = false) =>
  `<div class="stp ${small ? 'sm' : ''}"><span class="lab">${esc(label)}</span><div class="r"><button class="pm" ${minus} aria-label="Minus">–</button><span class="v" ${valueAttrs}>${esc(value)}</span><button class="pm" ${plus} aria-label="Plus">${ic('plus', 22)}</button></div></div>`;
function fld(key, label, value, o = {}) {
  const input = o.textarea ? `<textarea data-f="${key}" ${o.ml ? `maxlength="${o.ml}"` : ''} placeholder="${esc(o.ph || '')}">${esc(value)}</textarea>`
    : `<input data-f="${key}" value="${esc(value)}" ${o.type ? `type="${o.type}"` : ''} ${o.im ? `inputmode="${o.im}"` : ''} autocomplete="off" ${o.ml ? `maxlength="${o.ml}"` : ''} placeholder="${esc(o.ph || '')}">`;
  return `<div class="fld ${o.err ? 'err' : ''} ${o.cls || ''}">${input}<label>${esc(label)}</label></div>${o.err ? `<div class="ferr" data-err="${key}">${esc(o.err)}</div>` : o.hint ? `<div class="fhint">${esc(o.hint)}</div>` : `<div class="ferr" data-err="${key}" hidden></div>`}`;
}
function topBar(title, o = {}) {
  return `<div class="top">${o.back ? `<button class="ib" data-back aria-label="Zurück">${ic('back', 24)}</button>` : ''}<h1>${esc(title)}</h1>${o.actions || ''}</div>`;
}
const fab = (label, act, notabs = false) => `<button class="fab ${notabs ? 'notabs' : ''}" data-act="${act}">${ic('plus', 22)}${esc(label)}</button>`;
const empty = (title, text, name = 'spark') => `<div style="text-align:center;padding:24px 32px"><div style="width:64px;height:64px;border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;color:var(--primary);background:linear-gradient(135deg,color-mix(in srgb,var(--primary) 22%,transparent),color-mix(in srgb,var(--secondary) 18%,transparent))">${ic(name, 30)}</div><div class="t-tm">${esc(title)}</div><p class="t-sm" style="margin:6px 0 0">${esc(text)}</p></div>`;

// ---------- Datum (wie DateTimeFormatter mit Locale.GERMANY) ----------
const WD_S = ['Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.', 'So.'], WD_L = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const MO_S = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'], MO_L = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const p2 = (n) => String(n).padStart(2, '0');
const wdIdx = (d) => (d.getDay() + 6) % 7;
const fmtDay = (ep) => { const d = dateOfEpochDay(ep); return `${WD_S[wdIdx(d)]}, ${d.getDate()}. ${MO_S[d.getMonth()]}`; };
const fmtDayLong = (ep) => { const d = dateOfEpochDay(ep); return `${WD_L[wdIdx(d)]}, ${d.getDate()}. ${MO_L[d.getMonth()]}`; };
const fmtDM = (ep) => { const d = dateOfEpochDay(ep); return `${d.getDate()}.${d.getMonth() + 1}`; };
const fmtDateTime = (ms) => { const d = new Date(ms); return `${WD_S[wdIdx(d)]}, ${d.getDate()}. ${MO_S[d.getMonth()]} ${d.getFullYear()} · ${p2(d.getHours())}:${p2(d.getMinutes())}`; };
const hm = (m) => `${p2(Math.floor(m / 60))}:${p2(m % 60)}`;
const fmtTime = (d) => { const t = new Date(); const same = d.toDateString() === t.toDateString(); return (same ? '' : WD_S[wdIdx(d)] + ' ') + `${p2(d.getHours())}:${p2(d.getMinutes())}`; };
const unitL = () => Units.label(S.unit);

// ---------- gemeinsame Berechnungen ----------
function recoveryNow() {
  const n = now(), ex = Q.exMap();
  return RecoveryCalc.compute(db.sets.filter((s) => n - s.createdAt < 7 * 24 * 3600000).map((s) => { const e = ex.get(s.exerciseId); return e ? { muscleGroup: e.muscleGroup, createdAt: s.createdAt, setType: s.setType } : null; }).filter(Boolean), n);
}
const recColor = (p) => (p >= 85 ? C.mint : p >= 55 ? C.amber : C.coral);
function recoveryCard(list, compact, attrs = '') {
  const ready = list.filter((m) => m.percent >= 85).length;
  const shown = compact ? [...list].sort((a, b) => a.percent - b.percent).slice(0, 5) : list;
  return card(`<div class="row">${badge('recovery', C.mint, 30)}<div class="grow"><div class="t-tm">Muskel-Erholung</div><div class="t-lab">${ready} von ${list.length} Gruppen bereit</div></div></div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">${shown.map((m) => `<div class="row"><span style="width:110px;font-size:14px;white-space:nowrap;overflow:hidden">${esc(m.muscle)}</span><div class="grow">${ART.bar(m.percent / 100, recColor(m.percent), 8)}</div><span class="tn" style="width:52px;text-align:right;font-weight:600;font-size:14px">${m.percent} %</span></div>`).join('')}</div>
    ${compact ? '<div class="t-ls" style="margin-top:6px;letter-spacing:.3px;font-weight:500">Am wenigsten erholt zuerst. Vereinfachte Schätzung, kein medizinischer Wert.</div>' : ''}`, { attrs });
}
const dailyWeights = () => { const m = new Map(); [...db.bodyWeights].sort((a, b) => a.epochDay - b.epochDay || a.createdAt - b.createdAt).forEach((w) => m.set(w.epochDay, w)); return [...m.values()]; };
const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);

// ================= Heute =================
function greeting() { const h = new Date().getHours(); return h >= 5 && h <= 10 ? 'Guten Morgen' : h >= 11 && h <= 17 ? 'Hallo' : h >= 18 && h <= 22 ? 'Guten Abend' : 'Gute Nacht'; }
function vToday() {
  const today = todayEpochDay(), finished = db.sessions.filter((s) => s.endedAt != null);
  const sensor = {}, manual = {};
  db.stepCounts.forEach((x) => (sensor[x.epochDay] = x.steps));
  db.activity.forEach((a) => (manual[a.epochDay] = (manual[a.epochDay] || 0) + a.steps));
  const stepDays = [...new Set([...Object.keys(sensor), ...Object.keys(manual)])].map(Number).filter((d) => (sensor[d] || 0) + (manual[d] || 0) >= S.stepGoal);
  const trained = new Set(finished.map((s) => epochDayOf(s.startedAt)));
  const activeDays = new Set([...trained, ...db.activity.filter((a) => a.minutes > 0).map((a) => a.epochDay), ...stepDays]);
  const ws = Stats.weekStart(today), weekDone = [...trained].filter((d) => d >= ws && d <= today).length;
  const plans = Q.plansSorted(), next = nextPlan(plans, db.sessions), nextCount = next ? db.planExercises.filter((i) => i.planId === next.id).length : 0;
  const streak = Streak.current(activeDays, today);
  const waterMl = sum(db.water.filter((w) => w.epochDay === today), (w) => w.ml);
  const actToday = db.activity.filter((a) => a.epochDay === today), sensorSteps = sensor[today] || 0;
  const steps = sum(actToday, (a) => a.steps) + sensorSteps, minutes = sum(actToday, (a) => a.minutes);
  const nut = db.nutrition.filter((n) => n.epochDay === today), kcal = sum(nut, (n) => n.kcal), protein = sum(nut, (n) => n.proteinG);
  const weights = dailyWeights().map((w) => w.weightKg).slice(-14);
  const delta = weights.length >= 2 ? weights[weights.length - 1] - weights[0] : null;
  const active = Q.active();
  let h = `<div class="page screen"><div class="row hello"><div class="grow"><div class="t-ls" style="color:var(--primary)">${esc(fmtDayLong(today).toUpperCase())}</div><div class="t-h">${greeting()}</div></div><button class="ib" data-go="settings" aria-label="Einstellungen">${ic('tune', 24)}</button></div>`;
  if (active) {
    h += card(`${pill('Läuft', C.amber, 'timer')}<div class="t-title" style="margin-top:6px">${esc(active.name)}</div><div class="t-sm">Tippen, um weiter zu loggen</div>`, { accent: C.amber, attrs: `data-act="open-active"` });
  } else if (next) {
    h += `<div class="hero"><div class="row"><span class="t-ls grow" style="color:var(--primary)">${trained.has(today) ? 'HEUTE SCHON TRAINIERT · NÄCHSTES' : 'NÄCHSTES WORKOUT'}</span>${pill(next.category, C.violet)}</div>
      <div class="t-h" style="margin-top:8px">${esc(next.name)}</div><div class="t-sm" style="font-size:14px">${nextCount === 1 ? '1 Übung' : nextCount + ' Übungen'}</div>
      <div class="row" style="margin-top:16px"><button class="btn f" data-act="start-next" data-id="${next.id}">${ic('play', 22)}<b>Jetzt starten</b></button><button class="btn o" style="height:54px" data-go="training">Anderer Plan</button></div></div>`;
  }
  h += `<div class="two">${card(`<div class="row">${badge('flame', C.amber, 28)}<span class="t-lab">Serie</span></div><div class="num" style="color:var(--amber);margin-top:8px">${streak}</div><div class="t-lab">${streak === 1 ? 'aktiver Tag' : 'aktive Tage in Folge'}</div>`)}
    ${card(`<div class="row" style="gap:12px">${ART.ring(weekDone / Math.max(1, S.weeklyGoal), 66, 8, C.violet, `<b class="tn" style="font-size:14px">${weekDone}/${S.weeklyGoal}</b>`)}<div><div style="font-weight:600;font-size:14px">Wochenziel</div><div class="t-lab">${weekDone >= S.weeklyGoal ? 'erreicht ✓' : (S.weeklyGoal - weekDone) + ' offen'}</div></div></div>`)}</div>`;
  h += sect('Quick-Log');
  h += card(`<div class="row" style="gap:16px">${ART.ring(waterMl / Math.max(1, S.waterGoalMl), 74, 9, C.sky, `<span style="color:var(--sky)">${ic('drop', 26)}</span>`)}<div class="grow"><div class="t-tm">Wasser</div>
    <div class="t-sm" style="font-size:14px">${Units.number(waterMl / 1000, 2)} / ${Units.number(S.waterGoalMl / 1000, 1)} l · ${Math.floor(waterMl * 100 / Math.max(1, S.waterGoalMl))} %</div>
    <div class="wrap" style="margin-top:6px"><button class="btn t s" data-act="water" data-v="250">+250 ml</button><button class="btn t s" data-act="water" data-v="500">+500 ml</button></div></div></div>`);
  h += card(`<div class="row">${badge('steps', C.mint, 30)}<div class="grow"><div class="t-tm">Schritte &amp; Aktivität</div><div class="t-lab">${minutes} aktive Minuten heute</div></div><span class="t-title tn" style="color:var(--primary)">${steps}</span><span class="t-lab" style="font-weight:600"> / ${S.stepGoal}</span></div>
    <div style="margin:8px 0 4px">${ART.bar(steps / Math.max(1, S.stepGoal), C.mint)}</div>
    <div class="t-ls" style="font-weight:500;letter-spacing:.2px">Auf dem iPhone ohne Schrittzähler-Zugriff – manuelle Eingabe.</div>
    <div class="wrap" style="margin-top:8px"><button class="btn t s" data-act="steps" data-v="1000">+1.000</button><button class="btn t s" data-act="steps" data-v="2500">+2.500</button><button class="btn t s" data-act="minutes" data-v="15">+15 Min</button><button class="btn t s" data-act="minutes" data-v="30">+30 Min</button></div>`);
  h += sect('Erholung') + recoveryCard(recoveryNow(), true, 'data-go="progress"');
  h += card(`<div class="row">${badge('pulse', C.amber, 30)}<span class="t-tm">Ernährung heute</span></div>
    <div class="row" style="margin-top:8px"><span class="grow">Kalorien</span><span class="muted">${kcal} / ${S.kcalGoal} kcal</span></div>${ART.bar(kcal / Math.max(1, S.kcalGoal), C.amber)}
    <div class="row" style="margin-top:8px"><span class="grow">Protein</span><span class="muted">${Units.number(protein, 0)} / ${S.proteinGoalG} g</span></div>${ART.bar(protein / Math.max(1, S.proteinGoalG), C.violet)}`, { attrs: 'data-go="body"' });
  h += sect('Körpergewicht');
  h += card(weights.length ? `<div class="row" style="align-items:flex-end;gap:10px"><span class="num">${Units.weight(weights[weights.length - 1], S.unit)}</span>${delta != null ? `<span class="muted" style="padding-bottom:6px">${delta > 0 ? '+' : ''}${Units.weight(delta, S.unit)} im Verlauf</span>` : ''}</div>
    ${weights.length >= 2 ? ART.lineChart(weights.map((w) => Units.toDisplay(w, S.unit))) : ''}` : '<span class="muted">Noch kein Gewicht eingetragen – im Tab „Körper“ in zwei Sekunden erledigt.</span>', { attrs: 'data-go="body"' });
  if (S.trainingReminder || S.waterReminder) {
    const parts = [nextTrainingAt() && 'Training ' + fmtTime(nextTrainingAt()), nextWaterAt() && 'Trinken ' + fmtTime(nextWaterAt())].filter(Boolean);
    h += `<div class="row t-ls" style="font-weight:500;letter-spacing:.2px">${ic('bell', 14)}<span>Nächste Erinnerung: ${parts.join(' · ')}</span></div>`;
  }
  return h + '</div>';
}

// ================= Training =================
function planCards() {
  const ex = Q.exMap();
  return Q.plansSorted().map((p) => {
    const items = Q.planItems(p.id), exercises = items.map((i) => ex.get(i.exerciseId)).filter(Boolean);
    const supersets = new Set(items.map((i) => i.supersetGroup).filter((g) => g !== 0)).size;
    return { plan: p, items, exercises, totalSets: sum(items, (i) => i.targetSets), supersets, minutes: Math.max(5, Math.floor(sum(items, (i) => i.targetSets * (40 + i.restSec)) / 60)), isProgram: p.category.startsWith('Programm') };
  });
}
function vTraining() {
  const active = Q.active(), cards = planCards();
  let h = topBar('Training', { actions: `<button class="ib" data-go="library" aria-label="Übungsbibliothek">${ic('search', 24)}</button>` }) + '<div class="page screen">';
  if (active) h += card(`<div class="row" style="gap:12px">${badge('pulse', C.amber)}<div class="grow">${pill('Training läuft', C.amber)}<div class="t-title">${esc(active.name)}</div></div><span style="color:var(--amber)">${ic('play', 24)}</span></div>`, { accent: C.amber, attrs: 'data-act="open-active"' });
  else h += `<div class="row"><button class="btn t grow" data-act="free">${ic('play', 18)}Freies Training</button><button class="btn t grow" data-go="library">${ic('dumbbell', 18)}Übungen</button></div>`;
  if (!cards.length) h += empty('Keine Pläne', 'Lege mit „Neuer Plan“ deinen ersten Trainingsplan an.', 'program');
  const groups = new Map(), progs = new Map();
  cards.forEach((c) => { const m = c.isProgram ? progs : groups; if (!m.has(c.plan.category)) m.set(c.plan.category, []); m.get(c.plan.category).push(c); });
  for (const [cat, list] of [...groups, ...progs]) {
    h += sect(cat.startsWith('Programm') ? 'Programm · ' + cat.replace(/^Programm /, '') : cat);
    for (const c of list) {
      h += card(`<div class="row" style="gap:12px">${badge(c.isProgram ? 'program' : 'dumbbell', c.isProgram ? C.violet : C.mint)}<div class="grow"><div class="t-title">${esc(c.plan.name)}</div>${c.plan.description ? `<div class="t-sm" style="font-size:12.5px">${esc(c.plan.description)}</div>` : ''}</div>
        <button class="ib" data-act="plan-menu" data-id="${c.plan.id}" aria-label="Mehr">${ic('more', 22)}</button></div>
        <div class="wrap s" style="margin-top:8px">${pill(c.exercises.length + ' Übungen', C.mint, 'dumbbell')}${pill(c.totalSets + ' Sätze', C.sky)}${pill('≈ ' + c.minutes + ' min', C.amber, 'timer')}${c.supersets > 0 ? pill(c.supersets + ' Supersatz' + (c.supersets > 1 ? 'e' : ''), C.violet, 'link') : ''}</div>
        <div class="figs" style="margin-top:8px">${c.exercises.slice(0, 6).map((e) => ART.figure(e, { arrow: false })).join('')}${c.exercises.length > 6 ? `<span class="muted">+${c.exercises.length - 6}</span>` : ''}</div>
        <div class="t-sm" style="font-size:12.5px">${esc(c.exercises.map((e) => e.name).join(' · '))}</div>
        <button class="btn f w" style="margin-top:12px" data-act="start-plan" data-id="${c.plan.id}" ${active ? 'disabled' : ''}>${ic('play', 18)}Starten</button>`, { accent: c.isProgram ? C.violet : null, attrs: `data-act="edit-plan" data-id="${c.plan.id}"`, cls: 'plan' });
    }
  }
  return h + '</div>' + fab('Neuer Plan', 'new-plan');
}

// ================= Plan-Editor =================
function vPlanEditor() {
  const E = UI.editor, ex = Q.exMap();
  let h = topBar(E.planId ? 'Plan bearbeiten' : 'Neuer Plan', { back: true, actions: `<button class="tb" data-act="pe-save" ${E.items.length ? '' : 'disabled'}>Speichern</button>` }) + '<div class="page notabs screen">';
  h += card(fld('planName', 'Name', E.plan.name, { err: E.plan.name.trim() ? '' : 'Leer = „Mein Plan“' }) + '<div style="height:8px"></div>' + fld('planDesc', 'Beschreibung (optional)', E.plan.description) + '<div style="height:8px"></div>' + fld('planCat', 'Kategorie (Rotation „Nächstes Workout“)', E.plan.category));
  if (!E.items.length) h += empty('Noch keine Übungen', 'Füge unten Übungen hinzu. Ohne Übung lässt sich der Plan nicht speichern.', 'dumbbell');
  E.items.forEach((it, i) => {
    const e = ex.get(it.exId); if (!e) return;
    const linkedPrev = i > 0 && E.items[i - 1].linkNext, time = e.trackType === 'TIME';
    const mini = (lab, val, k) => `<div class="mini"><span class="lab">${lab}</span><b class="tn">${val}</b><div class="r"><button data-act="pe-step" data-i="${i}" data-k="${k}" data-d="-1">–</button><button data-act="pe-step" data-i="${i}" data-k="${k}" data-d="1">+</button></div></div>`;
    h += card(`<div class="row">${ART.figure(e, { arrow: false, cls: 'f48' })}<div class="grow"><div class="t-tm">${esc(e.name)}</div><div class="t-ls" style="font-weight:600;letter-spacing:.5px">${esc(e.muscleGroup)}</div></div>
      <button class="ib" data-act="pe-move" data-i="${i}" data-d="-1" ${i > 0 ? '' : 'disabled style="opacity:.3"'} aria-label="Nach oben">${ic('up')}</button><button class="ib" data-act="pe-move" data-i="${i}" data-d="1" ${i < E.items.length - 1 ? '' : 'disabled style="opacity:.3"'} aria-label="Nach unten">${ic('down')}</button><button class="ib" data-act="pe-del" data-i="${i}" aria-label="Entfernen">${ic('trash')}</button></div>
      <div class="row" style="gap:6px;margin-top:4px">${mini('Sätze', it.sets, 'sets')}${mini(time ? 'Sek. von' : 'Wdh. von', it.minReps, 'min')}${mini('bis', it.maxReps, 'max')}${mini('Pause', it.rest + 's', 'rest')}</div>
      ${i < E.items.length - 1 ? `<button class="chip ${it.linkNext ? 'on' : ''}" data-act="pe-link" data-i="${i}" style="margin-top:6px;max-width:100%;overflow:hidden">${ic('link', 18)}${esc(it.linkNext ? `Supersatz mit „${ex.get(E.items[i + 1].exId)?.name || ''}“` : 'Mit nächster Übung als Supersatz')}</button>` : ''}`, { accent: it.linkNext || linkedPrev ? C.violet : null });
  });
  return h + `<button class="btn t w" data-act="pe-add">${ic('plus')}Übung hinzufügen</button></div>`;
}

// ================= Übungsbibliothek =================
const trackLabel = (t) => (t === 'WEIGHT_REPS' ? 'Gewicht × Wdh.' : t === 'REPS' ? 'Nur Wdh.' : t === 'TIME' ? 'Zeit' : t);
function filterExercises(all, q, muscle, equip) {
  q = (q || '').trim().toLowerCase();
  return all.filter((e) => (!muscle || e.muscleGroup === muscle) && (!equip || e.equipment === equip) && (!q || e.name.toLowerCase().includes(q) || e.equipment.toLowerCase().includes(q) || e.muscleGroup.toLowerCase().includes(q)));
}
const exRow = (e, act) => `<button class="exrow" data-act="${act}" data-id="${e.id}"><span class="figbox">${ART.figure(e, { arrow: false, cls: 'f60' })}</span><span class="grow"><span class="t-tm" style="display:block">${esc(e.name)}</span><span class="t-sm">${esc(e.muscleGroup)} · ${esc(e.equipment)}</span></span>${e.isCustom ? pill('Eigene', C.violet) : ''}</button>`;
function exList(st, act) {
  const list = filterExercises(Q.exercisesSorted(), st.q, st.muscle, st.equip);
  return list.length ? list.map((e) => exRow(e, act)).join('') : empty('Nichts gefunden', act === 'open-ex' ? 'Kein Treffer für diese Suche. Lege die Übung einfach selbst an.' : 'Andere Suche oder Muskelgruppe wählen.', 'search');
}
function searchAndFilter(st, prefix, withEquip) {
  return `<div class="search">${ic('search', 20)}<input data-f="${prefix}q" value="${esc(st.q)}" placeholder="Suchen: Name, Muskel, Gerät" autocomplete="off" type="search"></div>
    <div class="hscroll" style="margin-top:8px">${chip('Alle', !st.muscle, `data-act="${prefix}muscle" data-v=""`)}${SEED.muscles.map((m) => chip(m, st.muscle === m, `data-act="${prefix}muscle" data-v="${esc(m)}"`)).join('')}</div>
    ${withEquip ? `<div class="hscroll" style="margin-top:6px">${chip('Alle Geräte', !st.equip, `data-act="${prefix}equip" data-v=""`)}${SEED.equips.map((m) => chip(m, st.equip === m, `data-act="${prefix}equip" data-v="${esc(m)}"`)).join('')}</div>` : ''}`;
}
function vLibrary() {
  return topBar(`Übungen (${db.exercises.length})`, { back: true }) + `<div class="page notabs screen">${searchAndFilter(UI.lib, 'lib', true)}<div id="libList" style="margin-top:12px">${exList(UI.lib, 'open-ex')}</div></div>` + fab('Eigene Übung', 'add-ex', true);
}
function exStats(id) {
  const mine = db.sets.filter((s) => s.exerciseId === id && SetType.countsForStats(s.setType));
  const bySes = new Map(); mine.forEach((s) => { if (!bySes.has(s.sessionId)) bySes.set(s.sessionId, []); bySes.get(s.sessionId).push(s); });
  const order = (sid) => (byId('sessions', sid) || { startedAt: 0 }).startedAt;
  const history = [...bySes.entries()].sort((a, b) => order(a[0]) - order(b[0])).map(([, ss]) => Math.max(...ss.map((s) => OneRepMax.estimate(s.weightKg, s.reps))));
  return { sessions: bySes.size, bestE1rm: mine.length ? Math.max(...mine.map((s) => OneRepMax.estimate(s.weightKg, s.reps))) : 0, bestWeight: mine.length ? Math.max(...mine.map((s) => s.weightKg)) : 0, bestReps: mine.length ? Math.max(...mine.map((s) => s.reps)) : 0, history };
}
const statTile = (label, value, color = C.mint, sub = '', iconName = '') => card(`<div class="row" style="gap:6px">${iconName ? badge(iconName, color, 26) : ''}<span class="t-lab" style="white-space:nowrap">${esc(label)}</span></div><div class="num" style="color:${color};margin-top:8px;white-space:nowrap">${esc(value)}</div>${sub ? `<div class="t-lab">${esc(sub)}</div>` : ''}`, { cls: 'tile' });
function vExercise() {
  const e = byId('exercises', cur().id);
  if (!e) return topBar('Übung', { back: true });
  const st = exStats(e.id), steps = e.instructions.split('\n').filter((x) => x.trim());
  let h = topBar(e.name, { back: true }) + '<div class="page notabs screen">';
  h += card(ART.figure(e, { animate: true, cls: 'big' }) + `<div class="wrap s">${pill(e.muscleGroup)}${pill(e.equipment, C.violet)}${pill(trackLabel(e.trackType), C.amber)}</div>`);
  h += sect('Notiz', `<button class="tb" data-act="ex-note">${e.note.trim() ? 'Bearbeiten' : 'Hinzufügen'}</button>`);
  h += card(`<div class="row" style="gap:10px"><span style="color:var(--primary)">${ic('note')}</span><span class="${e.note.trim() ? '' : 'muted'}">${esc(e.note.trim() || 'Z. B. Sitzhöhe, Griffbreite, Hinweise – erscheint auch im Training.')}</span></div>`, { attrs: 'data-act="ex-note"' });
  h += sect("So geht's") + card(steps.length ? steps.map((s, i) => `<div class="row top0" style="padding:4px 0;gap:10px">${pill(String(i + 1))}<span style="font-size:16px;line-height:1.4">${esc(s)}</span></div>`).join('') : '<span class="muted">Keine Anleitung hinterlegt.</span>');
  if (st.sessions > 0) {
    h += sect('Deine Bestwerte');
    h += e.trackType === 'WEIGHT_REPS' ? `<div class="two">${statTile('Geschätztes 1RM', Units.weight(st.bestE1rm, S.unit))}${statTile('Max. Gewicht', Units.weight(st.bestWeight, S.unit), C.violet)}</div>`
      : `<div class="two">${statTile(e.trackType === 'TIME' ? 'Längste Zeit' : 'Meiste Wdh.', e.trackType === 'TIME' ? st.bestReps + ' s' : String(st.bestReps))}${statTile('Einheiten', String(st.sessions), C.violet)}</div>`;
    if (e.trackType === 'WEIGHT_REPS' && st.history.length >= 2) h += card('<div class="t-tm">1RM-Verlauf</div>' + ART.lineChart(st.history.map((v) => Units.toDisplay(v, S.unit))));
  }
  if (e.isCustom) h += `<button class="tb" data-act="ex-delete">Eigene Übung löschen</button>`;
  return h + '</div>';
}

// ================= Workout =================
function buildWorkout(sid) {
  const session = byId('sessions', sid); if (!session) return null;
  const planItems = session.planId != null ? Q.planItems(session.planId) : [];
  const ex = Q.exMap(), sets = Q.setsOf(sid).sort((a, b) => a.exerciseId - b.exerciseId || a.setIndex - b.setIndex);
  const ids = [...new Set([...planItems.map((i) => i.exerciseId), ...Q.parseIds(session.extraExerciseIds), ...sets.map((s) => s.exerciseId)])];
  const groups = [...new Set(planItems.map((i) => i.supersetGroup).filter((g) => g > 0))];
  const blocks = ids.map((exId) => {
    const e = ex.get(exId); if (!e) return null;
    const item = planItems.find((i) => i.exerciseId === exId) || null;
    const last = Q.lastSessionSets(exId, sid);
    const history = db.sets.filter((s) => s.exerciseId === exId && s.sessionId !== sid && SetType.countsForStats(s.setType));
    const lastWork = last.filter((s) => SetType.countsForStats(s.setType));
    const suggestion = e.trackType === 'TIME' ? null : Progression.suggest(lastWork.map((s) => ({ weight: s.weightKg, reps: s.reps })), item ? item.minReps : 8, item ? item.maxReps : 12, S.weightIncrementKg);
    const g = item ? item.supersetGroup : 0, members = g > 0 ? planItems.filter((i) => i.supersetGroup === g) : [];
    return { exercise: e, planItem: item, sets: sets.filter((s) => s.exerciseId === exId).sort((a, b) => a.setIndex - b.setIndex), lastSets: last, suggestion,
      bestE1rm: history.length ? Math.max(...history.map((s) => OneRepMax.estimate(s.weightKg, s.reps))) : 0, bestReps: history.length ? Math.max(...history.map((s) => s.reps)) : 0,
      bestWeight: Math.max(0, ...history.filter((s) => s.reps > 0).map((s) => s.weightKg)),
      supersetLabel: g > 0 && members.length > 1 ? String.fromCharCode(65 + groups.indexOf(g)) : null, supersetContinues: members.length > 1 && members[members.length - 1].exerciseId !== exId };
  }).filter(Boolean);
  const working = sets.filter((s) => SetType.countsForStats(s.setType));
  return { session, blocks, totalSets: working.length, totalVolume: Stats.volume(working.map((s) => ({ weight: s.weightKg, reps: s.reps }))) };
}
function defaultInput(b) {
  const lw = [...b.sets].reverse().find((s) => SetType.countsForStats(s.setType));
  if (lw) return { weightKg: lw.weightKg, reps: lw.reps, rpe: null, setType: 'NORMAL' };
  if (b.suggestion) return { weightKg: b.suggestion.weight, reps: b.suggestion.reps, rpe: null, setType: 'NORMAL' };
  const lf = b.lastSets.find((s) => SetType.countsForStats(s.setType));
  if (lf) return { weightKg: lf.weightKg, reps: lf.reps, rpe: null, setType: 'NORMAL' };
  return { weightKg: 0, reps: b.planItem ? b.planItem.minReps : b.exercise.trackType === 'TIME' ? 30 : 10, rpe: null, setType: 'NORMAL' };
}
const restAfter = (b, setType) => (!S.autoRest || !SetType.startsRest(setType) || b.supersetContinues ? 0 : b.planItem ? b.planItem.restSec : S.defaultRestSec);
function stepWeight(kg, up) {
  if (S.unit === 'KG') { const step = S.weightIncrementKg > 0 ? S.weightIncrementKg : 2.5; return Math.max(0, Progression.roundToStep(kg, step) + (up ? step : -step)); }
  const disp = Units.toDisplay(kg, 'LBS'); return Units.toKg(Math.max(0, Progression.roundToStep(disp, 5) + (up ? 5 : -5)), 'LBS');
}
const barInUnit = (st = S) => (st.unit === 'KG' ? st.barWeightKg : Math.abs(st.barWeightKg - 20) < 0.01 ? 45 : Progression.roundToStep(Units.toDisplay(st.barWeightKg, 'LBS'), 2.5));
const setBadge = (type, index, attrs = '') => `<${attrs ? 'button' : 'span'} class="sb ${SetType.short(type)}" ${attrs}>${type === 'NORMAL' ? index : SetType.short(type)}</${attrs ? 'button' : 'span'}>`;
function inputFor(sid, b) { const k = sid + ':' + b.exercise.id; return UI.inputs[k] || defaultInput(b); }
function restBanner() {
  const t = TM.ui(); if (!t || t.kind !== 'REST') return '';
  return `<div style="padding:0 16px;max-width:680px;margin:4px auto 0">${card(`<div class="row" style="gap:6px"><span style="color:var(--secondary)">${ic('timer', 18)}</span><span class="grow" style="color:var(--secondary);font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(t.snapshot.label)}</span><span class="t-ls" style="font-weight:500;letter-spacing:.2px">läuft auch im Hintergrund</span></div>
    <div class="row restb"><span class="big" data-live="rest-time">${Stats.formatDuration(t.state.remainingSec)}</span><button class="tb" data-act="rest-minus">−15</button><button class="tb" data-act="rest-plus">+15</button><button class="tb" data-act="rest-skip">Weiter</button></div>
    ${ART.bar(t.state.remainingSec / Math.max(1, t.snapshot.workSec), C.violet, 6, 'rest-bar')}`, { accent: C.violet, cls: 'restcard' })}</div>`;
}
function fmtSet(e, s) {
  if (e.trackType === 'WEIGHT_REPS') return `${Units.weight(s.weightKg, S.unit)} × ${s.reps}`;
  if (e.trackType === 'TIME') return `${s.reps} s` + (s.weightKg > 0 ? ' · ' + Units.weight(s.weightKg, S.unit) : '');
  return `${s.reps} Wdh.` + (s.weightKg > 0 ? ' · ' + Units.weight(s.weightKg, S.unit) : '');
}
function blockCard(sid, b) {
  const e = b.exercise, input = inputFor(sid, b), target = b.planItem ? b.planItem.targetSets : 0;
  const workDone = b.sets.filter((s) => SetType.countsForStats(s.setType)).length, done = target > 0 && workDone >= target;
  const isTime = e.trackType === 'TIME', isW = e.trackType === 'WEIGHT_REPS', repsLabel = isTime ? 's' : 'Wdh.';
  let h = `<div class="row">${ART.figure(e, { arrow: false, cls: 'f56' })}<div class="grow" style="margin-left:4px">${b.supersetLabel ? `<div class="t-ls" style="color:var(--secondary)">SUPERSATZ ${b.supersetLabel}</div>` : ''}<div class="t-tm">${esc(e.name)}</div>
    ${b.planItem ? `<div class="t-sm" style="font-size:12.5px">Ziel ${b.planItem.targetSets} × ${b.planItem.minReps === b.planItem.maxReps ? b.planItem.minReps : b.planItem.minReps + '–' + b.planItem.maxReps} ${repsLabel} · ${b.planItem.restSec} s Pause</div>` : ''}</div>
    ${target > 0 ? pill(`${workDone}/${target}`, done ? C.mint : C.muted, done ? 'check' : null) : ''}<button class="ib" data-act="ex-menu" data-ex="${e.id}" aria-label="Übungsmenü">${ic('more')}</button></div>`;
  if (e.note.trim()) h += `<div class="note" style="margin-top:8px">${ic('note', 16)}<span>${esc(e.note)}</span></div>`;
  if (b.suggestion) {
    const sg = b.suggestion, txt = sg.weight > 0 ? `${Units.weight(sg.weight, S.unit)} × ${sg.reps}` : `${sg.reps} Wdh.`;
    h += `<div class="row" style="margin-top:8px"><button class="chip" data-act="sug" data-ex="${e.id}">${ic('spark', 16)}Vorschlag: ${esc(txt)}</button><span class="t-ls grow" style="font-weight:500;letter-spacing:.2px">${esc(sg.reason)}</span></div>`;
  }
  if (b.sets.length || b.lastSets.length) {
    h += `<div class="settbl"><div class="sethd"><span style="width:44px">SATZ</span><span style="flex:1">VORHER</span><span style="flex:1.2">HEUTE</span><span style="width:40px"></span></div>`;
    const rows = Math.max(b.sets.length, b.sets.length ? 0 : Math.min(b.lastSets.length, Math.max(1, target)));
    for (let i = 0; i < rows; i++) {
      const s = b.sets[i], prev = b.lastSets[i];
      const idx = b.sets.slice(0, i + 1).filter((x) => SetType.countsForStats(x.setType)).length;
      h += `<div class="setrow ${s && i % 2 === 0 ? 'z' : ''}"><span class="c1">${s ? setBadge(s.setType, idx, `data-act="cycle" data-set="${s.id}" aria-label="Satzart wechseln"`) : `<span class="muted" style="padding-left:10px;font-weight:600">${i + 1}</span>`}</span>
        <span class="c2">${prev ? esc(fmtSet(e, prev)) : '–'}</span><span class="c3"><span class="nums">${s ? esc(fmtSet(e, s)) : ''}</span>${s && s.rpe != null ? `<div class="t-ls" style="font-weight:500;letter-spacing:.2px">RPE ${Units.number(s.rpe)} · RIR ${SetType.rir(s.rpe)}</div>` : ''}</span>
        <span class="c4">${s ? `<button class="ib" style="width:40px;height:40px;color:var(--muted)" data-act="del-set" data-set="${s.id}" aria-label="Satz löschen">${ic('close', 18)}</button>` : ''}</span></div>`;
    }
    h += '</div>';
    if (b.sets.length) h += '<div class="t-ls" style="font-weight:500;letter-spacing:.2px">Tipp: Auf die Satznummer tippen ändert die Satzart (W = Aufwärmen, D = Drop, F = Versagen).</div>';
  }
  h += `<div class="wrap" style="gap:12px;margin-top:8px">${isW ? stepper(`Gewicht (${unitL()})`, Units.number(Units.toDisplay(input.weightKg, S.unit)), `data-act="w-minus" data-ex="${e.id}"`, `data-act="w-plus" data-ex="${e.id}"`, `data-act="w-edit" data-ex="${e.id}" role="button"`) : ''}
    ${stepper(isTime ? 'Sekunden' : 'Wiederholungen', String(input.reps), `data-act="r-minus" data-ex="${e.id}"`, `data-act="r-plus" data-ex="${e.id}"`)}</div>`;
  h += `<div class="wrap s" style="margin-top:6px">${SetType.ALL.map((t) => chip(t === 'NORMAL' ? 'Arbeitssatz' : `${SetType.short(t)} · ${SetType.label(t)}`, input.setType === t, `data-act="stype" data-ex="${e.id}" data-v="${t}"`)).join('')}</div>`;
  if (!isTime) {
    h += `<div class="row" style="gap:4px;margin-top:6px;flex-wrap:wrap"><span class="t-lab">RPE</span>${[6, 7, 8, 9, 10].map((r) => chip(String(r), input.rpe === r, `data-act="rpe" data-ex="${e.id}" data-v="${r}"`)).join('')}</div>`;
    if (input.rpe != null) h += `<div class="t-ls" style="font-weight:500;letter-spacing:.2px">≈ ${SetType.rir(input.rpe)} Wiederholungen in Reserve (RIR)</div>`;
  }
  h += `<div class="row" style="margin-top:8px">${isTime ? `<button class="btn t" data-act="hold" data-ex="${e.id}">${ic('play', 18)}${input.reps} s</button>` : ''}<button class="btn f grow" data-act="log" data-ex="${e.id}">${ic('check')}<b>${input.setType === 'NORMAL' ? `Satz ${workDone + 1} speichern` : SetType.label(input.setType) + ' speichern'}</b></button></div>`;
  if (b.supersetContinues) h += '<div class="t-ls" style="color:var(--secondary);font-weight:500;letter-spacing:.2px;margin-top:4px">Supersatz: ohne Pause weiter zur nächsten Übung.</div>';
  const c = card(h, { accent: done ? C.mint : null, attrs: `data-block="${e.id}"` });
  return b.supersetLabel ? `<div class="ssbar">${c}</div>` : c;
}
function vWorkout() {
  const sid = cur().id, W = buildWorkout(sid);
  if (!W) return topBar('Training', { back: true }) + '<div class="page notabs"><p>Dieses Training existiert nicht mehr.</p></div>';
  let h = '<div class="stickhead">' + topBar(W.session.name, { back: true, actions: `<button class="tb" data-act="finish">Beenden</button><button class="ib" data-act="wo-menu" aria-label="Mehr">${ic('more')}</button>` });
  h += `<div style="padding:4px 16px;max-width:680px;margin:0 auto" class="wpills">${pill(Stats.formatDuration((now() - W.session.startedAt) / 1000), C.mint, 'timer', `data-live="wo-dur" data-start="${W.session.startedAt}"`)}${pill(W.totalSets === 1 ? '1 Satz' : W.totalSets + ' Sätze', C.violet, 'check')}${pill(Units.weight(W.totalVolume, S.unit, 0), C.amber, 'dumbbell')}</div>`;
  h += `<div id="restSlot">${restBanner()}</div></div><div class="page notabs screen" style="padding-top:8px">`;
  h += W.blocks.map((b) => blockCard(sid, b)).join('');
  h += `<button class="btn t w" data-act="add-exercise">${ic('plus')}Übung hinzufügen</button><button class="btn f w" style="height:56px" data-act="finish">${ic('check')}Training beenden</button>`;
  return h + '</div>';
}

// ================= Trainingsdetail =================
function vSession() {
  const s = byId('sessions', cur().id);
  if (!s) return topBar('Training', { back: true }) + '<div class="page notabs"><p>Training nicht gefunden.</p></div>';
  const ex = Q.exMap(), sets = Q.setsOf(s.id), groupsM = new Map();
  sets.forEach((x) => { if (!groupsM.has(x.exerciseId)) groupsM.set(x.exerciseId, []); groupsM.get(x.exerciseId).push(x); });
  const groups = [...groupsM.entries()].sort((a, b) => Math.min(...a[1].map((x) => x.createdAt)) - Math.min(...b[1].map((x) => x.createdAt))).filter(([id]) => ex.get(id)).map(([id, l]) => [ex.get(id), l.sort((a, b) => a.setIndex - b.setIndex)]);
  const work = sets.filter((x) => SetType.countsForStats(x.setType)), warm = sets.length - work.length;
  let h = topBar(s.name, { back: true, actions: '<button class="tb" data-act="sd-delete">Löschen</button>' }) + '<div class="page notabs screen">';
  h += card(`<div class="muted">${fmtDateTime(s.startedAt)}</div><div class="wrap s" style="margin-top:6px">${pill(Stats.formatDuration(((s.endedAt || now()) - s.startedAt) / 1000))}${pill((work.length === 1 ? '1 Satz' : work.length + ' Sätze') + (warm > 0 ? ` + ${warm} W` : ''), C.violet)}${pill(Units.weight(Stats.volume(work.map((x) => ({ weight: x.weightKg, reps: x.reps }))), S.unit, 0) + ' Volumen', C.amber)}</div>
    <div style="margin-top:8px">${esc(s.note.trim() ? s.note : 'Notiz hinzufügen …')}</div><button class="tb" style="margin-left:-12px" data-act="sd-note">Notiz bearbeiten</button>`, { accent: C.mint, cls: 'sdhead' });
  for (const [e, list] of groups) {
    const counting = list.filter((x) => SetType.countsForStats(x.setType));
    h += card(`<div class="t-tm">${esc(e.name)}</div>` + list.map((x) => {
      const t = e.trackType === 'WEIGHT_REPS' ? `${Units.weight(x.weightKg, S.unit)} × ${x.reps}` + (SetType.countsForStats(x.setType) && x.weightKg > 0 ? `  ·  1RM ≈ ${Units.weight(OneRepMax.estimate(x.weightKg, x.reps), S.unit)}` : '') : e.trackType === 'TIME' ? `${x.reps} s` : `${x.reps} Wdh.`;
      return `<div class="row" style="padding:2px 0">${setBadge(x.setType, counting.indexOf(x) + 1)}<span>${esc(t + (x.rpe != null ? ` · RPE ${Units.number(x.rpe)} (RIR ${SetType.rir(x.rpe)})` : ''))}</span></div>`;
    }).join(''));
  }
  return h + '</div>';
}

// ================= Timer =================
const PRESETS = [
  { name: 'Tabata', config: { prepareSec: 10, workSec: 20, restSec: 10, rounds: 8 } },
  { name: 'HIIT 40/20', config: { prepareSec: 10, workSec: 40, restSec: 20, rounds: 10 } },
  { name: '7-Minuten', config: { prepareSec: 10, workSec: 30, restSec: 10, rounds: 12 } },
  { name: 'EMOM 10', config: { prepareSec: 10, workSec: 60, restSec: 0, rounds: 10 } },
  { name: 'Zirkel 45/15', config: { prepareSec: 10, workSec: 45, restSec: 15, rounds: 8 } },
];
const cfgEq = (a, b) => a.prepareSec === b.prepareSec && a.workSec === b.workSec && a.restSec === b.restSec && a.rounds === b.rounds;
function timerLook() {
  const r = TM.ui(), isRest = r && r.kind === 'REST', st = r ? r.state : null;
  const color = !r ? 'var(--outline)' : r.paused ? 'var(--muted)' : isRest ? C.violet : st.phase === 'WORK' ? C.mint : st.phase === 'REST' ? C.violet : st.phase === 'PREPARE' ? C.amber : C.sky;
  const name = !r ? 'Bereit' : r.paused ? 'Pausiert' : isRest ? r.snapshot.label : st.phase === 'PREPARE' ? "Gleich geht's los" : st.phase === 'WORK' ? 'Arbeit' : st.phase === 'REST' ? 'Pause' : 'Geschafft!';
  const len = Math.max(1, !r ? 1 : isRest ? r.snapshot.workSec : Interval.phaseLength(st));
  return { r, isRest, st, color, name, progress: r ? st.remainingSec / len : 0 };
}
function vTimer() {
  const D = UI.draft, L = timerLook(), r = L.r, active = !!r, cfg = D.config;
  let h = topBar('Timer') + '<div class="page screen" style="text-align:center">';
  h += `<div class="tring">${ART.ring(L.progress, 248, 18, L.color, `<div data-live="t-phase" style="font-weight:600;font-size:16px;color:${L.color};max-width:190px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(L.name)}</div>
    <div class="tbig" data-live="t-time">${Stats.formatDuration(active ? L.st.remainingSec : Interval.totalSec(cfg))}</div>${!L.isRest ? `<div class="t-lab" style="font-weight:600;font-size:14px" data-live="t-round">${active ? `Runde ${L.st.round} / ${L.st.config.rounds}` : `${esc(D.name)} · ${cfg.rounds} Runden`}</div>` : ''}`, 't-ring')}</div>`;
  if (active && !L.isRest) h += ART.bar(Interval.totalProgress(L.st), L.color, 8, 't-total');
  h += '<div class="row">';
  if (!r) h += `<button class="btn f xl grow" data-act="t-start">${ic('play')}<b>Start</b></button>`;
  else if (L.isRest) h += `<button class="btn o xl" data-act="rest-minus">−15</button><button class="btn o xl" data-act="rest-plus">+15</button><button class="btn f xl grow" data-act="t-skip">Pause beenden</button>`;
  else h += (r.paused ? `<button class="btn f xl grow" data-act="t-resume">${ic('play')}Weiter</button>` : `<button class="btn f xl grow" data-act="t-pause">${ic('pause')}Pause</button>`) +
    `<button class="btn o xl" data-act="t-skip" aria-label="Nächste Phase">${ic('skip', 20)}</button><button class="btn o xl" data-act="t-stop" aria-label="Stopp">${ic('stop', 20)}</button>`;
  h += '</div>';
  if (active) h += `<div class="row t-sm" style="justify-content:center;text-align:left">${ic('bell', 16)}<span>Läuft weiter, wenn du die App verlässt – Hinweis per Mitteilung am Ende.</span></div>`;
  h += sect('Vorlagen') + `<div class="wrap" style="justify-content:flex-start">${PRESETS.map((p, i) => chip(`${p.name} · ${p.config.workSec}/${p.config.restSec} × ${p.config.rounds}`, cfgEq(cfg, p.config) && D.name === p.name, `data-act="preset" data-v="${i}"`, active)).join('')}</div>`;
  h += sect('Eigenes Intervall') + card(`<div class="wrap" style="gap:12px;justify-content:center">${stepper('Arbeit (s)', String(cfg.workSec), 'data-act="cfg" data-k="workSec" data-d="-5"', 'data-act="cfg" data-k="workSec" data-d="5"')}
    ${stepper('Pause (s)', String(cfg.restSec), 'data-act="cfg" data-k="restSec" data-d="-5"', 'data-act="cfg" data-k="restSec" data-d="5"')}
    ${stepper('Runden', String(cfg.rounds), 'data-act="cfg" data-k="rounds" data-d="-1"', 'data-act="cfg" data-k="rounds" data-d="1"')}
    ${stepper('Vorlauf (s)', String(cfg.prepareSec), 'data-act="cfg" data-k="prepareSec" data-d="-5"', 'data-act="cfg" data-k="prepareSec" data-d="5"')}</div>
    <div class="muted" style="margin-top:6px;text-align:left">Gesamtdauer: ${Stats.formatDuration(Interval.totalSec(cfg))}</div>${active ? '<div class="t-ls" style="text-align:left;font-weight:500;letter-spacing:.2px">Änderungen gelten für den nächsten Start.</div>' : ''}`);
  h += sect('Nur Pause') + `<div class="wrap">${[60, 90, 120, 180].map((s) => `<button class="btn t s" data-act="rest-only" data-v="${s}">${Stats.formatDuration(s)}</button>`).join('')}</div>`;
  h += '<p class="t-sm" style="text-align:left">Tipp: Nach jedem gespeicherten Satz startet die Pause im Training automatisch. Der Bildschirm bleibt an, solange ein Timer läuft.</p>';
  return h + '</div>';
}

// ================= Körper =================
function vBody() {
  const B = UI.body, today = todayEpochDay(), u = S.unit, ul = unitL();
  const entry = (text, act, id) => `<div class="entry"><span>${esc(text)}</span><button class="ib" data-act="${act}" data-id="${id}" aria-label="Löschen">${ic('close', 18)}</button></div>`;
  let h = topBar('Körper & Gesundheit') + '<div class="page screen">';
  const daily = dailyWeights();
  let wc = '';
  if (daily.length) {
    const last = daily[daily.length - 1];
    wc += `<div class="row" style="align-items:flex-end;gap:8px"><span class="num">${Units.weight(last.weightKg, u)}</span><span class="muted" style="padding-bottom:6px">am ${fmtDay(last.epochDay)}</span></div>`;
    if (daily.length >= 2) {
      const vals = daily.slice(-60).map((w) => Units.toDisplay(w.weightKg, u));
      wc += ART.lineChart(vals, { maxLabel: Units.number(Math.max(...vals)) + ' ' + ul, minLabel: Units.number(Math.min(...vals)) + ' ' + ul });
      wc += `<div class="t-lab">7-Tage-Schnitt: ${Units.number(Stats.movingAverage(vals, 7).pop())} ${ul}</div>`;
    }
  }
  wc += `<div class="row top0" style="margin-top:10px"><div class="grow">${fld('weight', `Heute (${ul})`, B.weight, { im: 'decimal', err: B.weightErr })}</div><button class="btn f" style="height:54px;margin-top:6px" data-act="save-weight">Speichern</button></div>`;
  const ws = [...db.bodyWeights].sort((a, b) => a.epochDay - b.epochDay || a.createdAt - b.createdAt);
  wc += ws.slice(-5).reverse().map((w) => entry(`${fmtDay(w.epochDay)} · ${Units.weight(w.weightKg, u)}`, 'del-weight', w.id)).join('');
  h += sect('Körpergewicht') + card(wc, { cls: 'weightcard' });
  const ms = [...db.measurements].sort((a, b) => a.epochDay - b.epochDay || a.createdAt - b.createdAt);
  const latest = {}; ms.forEach((m) => (latest[m.kind] = m));
  let mc = '';
  if (Object.keys(latest).length) {
    mc += `<div class="wrap" style="gap:6px 16px;margin-bottom:8px">${SEED.measurementKinds.filter((k) => latest[k]).map((k) => { const hist = ms.filter((m) => m.kind === k), d = hist.length >= 2 ? hist[hist.length - 1].value - hist[0].value : null;
      return `<div><div class="t-lab">${esc(k)}</div><div class="t-title">${Units.number(latest[k].value)}${k.endsWith('%') ? ' %' : ' cm'}</div>${d != null ? `<div class="t-ls" style="font-weight:500;letter-spacing:.2px">${d > 0 ? '+' : ''}${Units.number(d)}</div>` : ''}</div>`; }).join('')}</div>`;
  }
  mc += `<div class="wrap s">${SEED.measurementKinds.map((k) => chip(k, B.mkind === k, `data-act="m-kind" data-v="${esc(k)}"`)).join('')}</div>`;
  mc += `<div class="row top0" style="margin-top:8px"><div class="grow">${fld('measure', B.mkind.endsWith('%') ? B.mkind : B.mkind + ' (cm)', B.measure, { im: 'decimal', err: B.measureErr })}</div><button class="btn f" style="height:54px;margin-top:6px" data-act="save-measure">Speichern</button></div>`;
  mc += ms.slice(-4).reverse().map((m) => entry(`${fmtDay(m.epochDay)} · ${m.kind}: ${Units.number(m.value)}`, 'del-measure', m.id)).join('');
  h += sect('Körpermaße') + card(mc);
  const nut = db.nutrition.filter((n) => n.epochDay === today).sort((a, b) => a.createdAt - b.createdAt), kcal = sum(nut, (n) => n.kcal), prot = sum(nut, (n) => n.proteinG);
  h += sect('Ernährung heute') + card(`<div class="row"><span class="grow">Kalorien</span><span>${kcal} / ${S.kcalGoal} kcal</span></div>${ART.bar(kcal / Math.max(1, S.kcalGoal), C.amber)}
    <div class="row" style="margin-top:8px"><span class="grow">Protein</span><span>${Units.number(prot, 0)} / ${S.proteinGoalG} g</span></div>${ART.bar(prot / Math.max(1, S.proteinGoalG), C.violet)}
    <div style="font-weight:600;font-size:14px;margin-top:10px">Quick-Add</div><div class="wrap" style="margin-top:6px">${FOODS.map((f, i) => `<button class="btn t s" data-act="food" data-v="${i}">${f[3]}</button>`).join('')}<button class="btn t s" data-act="food-custom">Eigener Eintrag</button></div>
    ${[...nut].reverse().map((n) => entry(`${n.label.trim() || 'Eintrag'} · ${n.kcal} kcal · ${Units.number(n.proteinG, 0)} g`, 'del-food', n.id)).join('')}`);
  const water = db.water.filter((w) => w.epochDay === today).sort((a, b) => a.createdAt - b.createdAt), ml = sum(water, (w) => w.ml);
  h += sect('Wasser heute') + card(`<div class="row"><span class="num grow" style="color:var(--sky)">${Units.number(ml / 1000, 2)} l</span><span class="muted">Ziel ${Units.number(S.waterGoalMl / 1000, 1)} l</span></div>${ART.bar(ml / Math.max(1, S.waterGoalMl), C.sky)}
    <div class="wrap" style="margin-top:8px">${[150, 250, 330, 500, 750].map((v) => `<button class="btn t s" data-act="water" data-v="${v}">+${v} ml</button>`).join('')}</div>
    ${[...water].reverse().slice(0, 6).map((w) => entry(`${w.ml} ml`, 'del-water', w.id)).join('')}`, { cls: 'watercard' });
  const act = db.activity.filter((a) => a.epochDay === today).sort((a, b) => a.createdAt - b.createdAt);
  const sensor = (db.stepCounts.find((x) => x.epochDay === today) || { steps: 0 }).steps, manualSteps = sum(act, (a) => a.steps), steps = manualSteps + sensor;
  h += sect('Aktivität heute') + card(`<div class="row"><span class="grow">Schritte</span><span>${steps} / ${S.stepGoal}</span></div>${ART.bar(steps / Math.max(1, S.stepGoal))}
    ${sensor > 0 ? `<div class="t-ls" style="font-weight:500;letter-spacing:.2px">davon ${sensor} automatisch vom Schrittzähler, ${manualSteps} manuell</div>` : ''}<div class="t-lab" style="margin-top:4px">${sum(act, (a) => a.minutes)} aktive Minuten</div>
    <button class="btn t s" style="margin-top:8px" data-act="act-custom">Aktivität eintragen (z. B. Laufen, Rad)</button>
    ${[...act].reverse().map((a) => entry([a.label.trim() || null, a.steps > 0 ? a.steps + ' Schritte' : null, a.minutes > 0 ? a.minutes + ' Min' : null].filter(Boolean).join(' · '), 'del-act', a.id)).join('')}`);
  return h + '</div>';
}
const FOODS = [['Snack', 100, 0, '+100 kcal'], ['Kleine Mahlzeit', 300, 0, '+300 kcal'], ['Mahlzeit', 600, 0, '+600 kcal'], ['Protein', 0, 10, '+10 g Protein'], ['Protein-Shake', 120, 25, 'Shake 25 g']];

// ================= Fortschritt =================
function progressState() {
  const finished = db.sessions.filter((s) => s.endedAt != null), fin = new Set(finished.map((s) => s.id));
  const doneSets = db.sets.filter((s) => fin.has(s.sessionId)), work = doneSets.filter((s) => SetType.countsForStats(s.setType));
  const startById = {}; finished.forEach((s) => (startById[s.id] = s.startedAt));
  const summaries = finished.map((s) => {
    const ss = doneSets.filter((x) => x.sessionId === s.id), w = ss.filter((x) => SetType.countsForStats(x.setType));
    return { session: s, sets: w.length, volume: Stats.volume(w.map((x) => ({ weight: x.weightKg, reps: x.reps }))), durationSec: ((s.endedAt || s.startedAt) - s.startedAt) / 1000, exercises: new Set(ss.map((x) => x.exerciseId)).size, warmups: ss.length - w.length };
  });
  const ex = Q.exMap(), byEx = new Map();
  work.filter((s) => s.weightKg > 0 && s.reps > 0 && ex.get(s.exerciseId) && ex.get(s.exerciseId).trackType === 'WEIGHT_REPS').forEach((s) => { if (!byEx.has(s.exerciseId)) byEx.set(s.exerciseId, []); byEx.get(s.exerciseId).push(s); });
  const prs = [...byEx.entries()].map(([id, list]) => {
    const best = list.reduce((a, b) => (OneRepMax.estimate(b.weightKg, b.reps) > OneRepMax.estimate(a.weightKg, a.reps) ? b : a));
    const bs = new Map(); list.forEach((s) => { if (!bs.has(s.sessionId)) bs.set(s.sessionId, []); bs.get(s.sessionId).push(s); });
    const history = [...bs.entries()].sort((a, b) => (startById[a[0]] || 0) - (startById[b[0]] || 0)).map(([, l]) => Math.max(...l.map((s) => OneRepMax.estimate(s.weightKg, s.reps))));
    return { exercise: ex.get(id), bestE1rm: OneRepMax.estimate(best.weightKg, best.reps), bestSet: best, day: epochDayOf(startById[best.sessionId] || best.createdAt), history, maxWeight: Math.max(...list.map((s) => s.weightKg)) };
  }).sort((a, b) => b.bestE1rm - a.bestE1rm);
  const today = todayEpochDay(), thisWeek = Stats.weekStart(today), weeks = []; for (let i = 11; i >= 0; i--) weeks.push(thisWeek - i * 7);
  const vol = {}; work.forEach((s) => { const w = Stats.weekStart(epochDayOf(startById[s.sessionId] || s.createdAt)); vol[w] = (vol[w] || 0) + s.weightKg * s.reps; });
  const heat = {}; doneSets.forEach((s) => { const d = epochDayOf(startById[s.sessionId] || s.createdAt); heat[d] = (heat[d] || 0) + 1; });
  db.activity.filter((a) => a.minutes > 0).forEach((a) => (heat[a.epochDay] = (heat[a.epochDay] || 0) + Math.max(1, Math.floor(a.minutes / 10))));
  return { sessions: summaries, prs, weeklyVolume: weeks.map((w) => Units.toDisplay(vol[w] || 0, S.unit)), weekLabels: weeks.map(fmtDM), heat, trainingDays: new Set(finished.map((s) => epochDayOf(s.startedAt))),
    totalVolume: sum(summaries, (s) => s.volume), longestStreak: Streak.longest(new Set(Object.keys(heat).map(Number))), recovery: recoveryNow() };
}
function sessionRow(sm) {
  return card(`<div class="t-tm">${esc(sm.session.name)}</div><div class="t-sm" style="font-size:12.5px">${fmtDateTime(sm.session.startedAt)}</div>
    <div class="wrap s" style="margin-top:8px">${pill(Stats.formatDuration(sm.durationSec), C.mint, 'timer')}${pill(sm.exercises === 1 ? '1 Übung' : sm.exercises + ' Übungen', C.violet)}${pill((sm.sets === 1 ? '1 Satz' : sm.sets + ' Sätze') + (sm.warmups > 0 ? ` + ${sm.warmups} W` : ''), C.violet)}${sm.volume > 0 ? pill(Units.weight(sm.volume, S.unit, 0), C.amber) : ''}</div>`, { attrs: `data-act="open-session" data-id="${sm.session.id}"` });
}
function vProgress() {
  const P = progressState(), tab = UI.ptab;
  let h = topBar('Fortschritt') + `<div class="page screen"><div class="seg">${['Übersicht', 'Kalender', 'Rekorde', 'Verlauf'].map((l, i) => `<button class="${i === tab ? 'on' : ''}" data-act="ptab" data-v="${i}">${l}</button>`).join('')}</div>`;
  if (tab === 0) {
    h += `<div class="three">${statTile('Trainings', String(P.sessions.length), C.mint, '', 'dumbbell')}${statTile('Volumen', Units.number(Units.toDisplay(P.totalVolume, S.unit) / 1000, 1), C.violet, S.unit === 'KG' ? 'Tonnen' : '×1000 lbs', 'chart')}${statTile('Serie max.', String(P.longestStreak), C.amber, 'Tage', 'flame')}</div>`;
    h += recoveryCard(P.recovery, false);
    h += sect(`Volumen pro Woche (${unitL()}, ohne Aufwärmsätze)`) + card(ART.barChart(P.weeklyVolume, P.weekLabels.map((l, i) => (i % 4 === 3 ? l : ''))));
    h += sect('Aktivität') + card(ART.heatmap(P.heat, todayEpochDay()) + '<div class="t-ls" style="font-weight:500;letter-spacing:.2px;margin-top:6px">Letzte 18 Wochen · je kräftiger, desto mehr Sätze/Aktivität</div>');
  } else if (tab === 1) {
    const n = new Date(), m = new Date(n.getFullYear(), n.getMonth() + UI.calOffset, 1), y = m.getFullYear(), mo = m.getMonth();
    const days = new Date(y, mo + 1, 0).getDate(), lead = (m.getDay() + 6) % 7, today = todayEpochDay();
    const count = [...P.trainingDays].filter((d) => { const dd = dateOfEpochDay(d); return dd.getFullYear() === y && dd.getMonth() === mo; }).length;
    let grid = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => `<div class="h">${d}</div>`).join('');
    for (let i = 0; i < lead; i++) grid += '<div class="d"></div>';
    for (let d = 1; d <= days; d++) {
      const ep = LF.epochDayOfDate(new Date(y, mo, d)), tr = P.trainingDays.has(ep), ac = (P.heat[ep] || 0) > 0;
      grid += `<div class="d"><button class="${tr ? 'tr' : ac ? 'ac' : ''} ${ep === today ? 'td' : ''} ${ep === UI.selDay ? 'sel' : ''}" data-act="cal-day" data-v="${ep}">${d}</button></div>`;
    }
    h += card(`<div class="row"><button class="ib" data-act="cal-prev" aria-label="Voriger Monat">${ic('back')}</button><div class="grow" style="text-align:center"><div class="t-tm">${MO_L[mo]} ${y}</div><div class="t-lab">${count === 1 ? '1 Trainingstag' : count + ' Trainingstage'}</div></div>
      <button class="ib" data-act="cal-next" ${UI.calOffset < 0 ? '' : 'disabled style="opacity:.3"'} aria-label="Nächster Monat" style="transform:rotate(180deg)">${ic('back')}</button></div><div class="cal" style="margin-top:8px">${grid}</div>
      <div class="row" style="gap:16px;margin-top:8px"><span class="row t-ls" style="gap:4px"><i class="dot" style="background:var(--primary)"></i>Training</span><span class="row t-ls" style="gap:4px"><i class="dot" style="background:color-mix(in srgb,var(--sky) 45%,transparent)"></i>Aktivität</span></div>`);
    if (UI.selDay != null) {
      const list = P.sessions.filter((s) => epochDayOf(s.session.startedAt) === UI.selDay);
      h += sect(fmtDayLong(UI.selDay)) + (list.length ? list.map(sessionRow).join('') : '<div class="muted">Kein Training an diesem Tag.</div>');
    }
  } else if (tab === 2) {
    h += sect('Persönliche Rekorde (geschätztes 1RM)');
    if (!P.prs.length) h += empty('Noch keine Rekorde', 'Logge Arbeitssätze mit Gewicht – Lumvero Fit schätzt dein 1RM automatisch (Epley/Brzycki).', 'trophy');
    else {
      h += `<div class="hscroll">${P.prs.slice(0, 15).map((p) => chip(p.exercise.name, UI.selPr === p.exercise.id, `data-act="pr-sel" data-id="${p.exercise.id}"`)).join('')}</div>`;
      const sel = P.prs.find((p) => p.exercise.id === UI.selPr);
      if (sel) h += card(`<div class="t-tm">1RM-Verlauf: ${esc(sel.exercise.name)}</div>` + (sel.history.length >= 2 ? ART.lineChart(sel.history.map((v) => Units.toDisplay(v, S.unit))) : '<div class="muted">Ab zwei Einheiten erscheint hier der Verlauf.</div>'));
      h += P.prs.slice(0, 30).map((p) => card(`<div class="row" style="gap:12px">${ART.figure(p.exercise, { arrow: false, cls: 'f48' })}<div class="grow"><div class="t-tm">${esc(p.exercise.name)}</div>
        <div class="t-sm" style="font-size:12.5px">Bester Satz ${Units.weight(p.bestSet.weightKg, S.unit)} × ${p.bestSet.reps} · ${fmtDay(p.day)}</div><div class="t-sm" style="font-size:12.5px">Max. Gewicht ${Units.weight(p.maxWeight, S.unit)}</div></div>${pill(Units.weight(p.bestE1rm, S.unit), C.amber, 'trophy')}</div>`, { attrs: `data-act="open-ex" data-id="${p.exercise.id}"` })).join('');
    }
  } else {
    if (!P.sessions.length) h += empty('Noch keine Trainings', 'Starte im Tab „Training“ einen Plan oder ein freies Training.', 'calendar');
    else h += [...P.sessions].sort((a, b) => b.session.startedAt - a.session.startedAt).map(sessionRow).join('');
  }
  return h + '</div>';
}

// ================= Einstellungen =================
const INC_STEPS = [0.5, 1.0, 1.25, 2.0, 2.5, 5.0], BARS = [7.5, 10, 15, 20, 25], BARS_LBS = [15, 25, 35, 45, 55];
const lbsBarToKg = (l) => (l === 45 ? 20 : Units.toKg(l, 'LBS'));
const DAYS = [[1, 'Mo'], [2, 'Di'], [3, 'Mi'], [4, 'Do'], [5, 'Fr'], [6, 'Sa'], [7, 'So']];
function vSettings() {
  const head = (name, color, title) => `<div class="row" style="margin-bottom:8px">${badge(name, color, 30)}<span class="t-tm">${esc(title)}</span></div>`;
  const st = (label, value, k, d) => stepper(label, value, `data-act="set-step" data-k="${k}" data-d="-${d}"`, `data-act="set-step" data-k="${k}" data-d="${d}"`, '', true);
  let h = topBar('Einstellungen', { back: true }) + '<div class="page notabs screen">';
  h += sect('Darstellung') + card(head('tune', C.violet, 'Design & Einheit') + `<div style="font-weight:600;font-size:14px">Design</div><div class="wrap" style="margin:6px 0 10px">${chip('Dunkel', S.theme === 'DARK', 'data-act="set" data-k="theme" data-v="DARK"')}${chip('Hell', S.theme === 'LIGHT', 'data-act="set" data-k="theme" data-v="LIGHT"')}${chip('System', S.theme === 'SYSTEM', 'data-act="set" data-k="theme" data-v="SYSTEM"')}</div>
    <div style="font-weight:600;font-size:14px">Einheit</div><div class="wrap" style="margin-top:6px">${chip('Kilogramm (kg)', S.unit === 'KG', 'data-act="set" data-k="unit" data-v="KG"')}${chip('Pfund (lbs)', S.unit === 'LBS', 'data-act="set" data-k="unit" data-v="LBS"')}</div>`);
  h += sect('Training') + card(head('dumbbell', C.mint, 'Training') + `<div class="wrap" style="gap:12px">${st('Wochenziel (Trainings)', String(S.weeklyGoal), 'weeklyGoal', 1)}${st('Standard-Pause (s)', String(S.defaultRestSec), 'defaultRestSec', 15)}
    ${S.unit === 'KG' ? st('Gewichtssprung (kg)', Units.number(S.weightIncrementKg, 2), 'weightIncrementKg', 1) + st('Hantelstange (kg)', Units.number(S.barWeightKg, 1), 'barWeightKg', 1) : st('Hantelstange (lbs)', Units.number(barInUnit(), 0), 'barLbs', 1)}</div>
    ${S.unit === 'LBS' ? '<p class="t-sm">In Pfund ändern die +/−-Knöpfe das Gewicht in festen 5-lbs-Schritten.</p>' : ''}
    ${swRow('Pausen-Timer automatisch nach jedem Satz', S.autoRest, 'data-act="toggle" data-k="autoRest"')}${swRow('Rekord-Feier mit Konfetti', S.prCelebration, 'data-act="toggle" data-k="prCelebration"')}
    ${swRow('Ton-Signal', S.sound, 'data-act="toggle" data-k="sound"')}${swRow('Vibration', S.vibration, 'data-act="toggle" data-k="vibration"')}
    <button class="btn o s" style="margin-top:4px" data-act="test-feedback">Ton &amp; Vibration testen</button>`);
  let rem = head('bell', C.amber, 'Lokale Erinnerungen') + swRow('Trainingserinnerung', S.trainingReminder, 'data-act="toggle" data-k="trainingReminder"');
  if (S.trainingReminder) rem += `<div class="row"><span class="grow">Uhrzeit</span><button class="btn t s" data-act="time" data-k="trainingReminderMinute">${hm(S.trainingReminderMinute)}</button></div>
    <div class="wrap s" style="margin-top:6px">${DAYS.map(([d, l]) => chip(l, S.trainingDays.includes(d), `data-act="rem-day" data-v="${d}"`)).join('')}</div><div class="t-ls" style="font-weight:500;letter-spacing:.2px;margin-top:4px">Kommt an den gewählten Tagen zur eingestellten Uhrzeit (iOS kann nicht vorher prüfen, ob schon trainiert wurde).</div>`;
  rem += '<hr>' + swRow('Trinkerinnerung', S.waterReminder, 'data-act="toggle" data-k="waterReminder"');
  if (S.waterReminder) rem += `<div class="row"><span class="grow">Von – bis</span><button class="btn t s" data-act="time" data-k="waterFromMinute">${hm(S.waterFromMinute)}</button><button class="btn t s" data-act="time" data-k="waterToMinute">${hm(S.waterToMinute)}</button></div>
    <div class="wrap s" style="margin-top:6px">${[60, 90, 120, 180].map((m) => chip(m % 60 === 0 ? `alle ${m / 60} h` : `alle ${m} min`, S.waterIntervalMin === m, `data-act="set" data-k="waterIntervalMin" data-v="${m}" data-num="1"`)).join('')}</div>
    <div class="t-ls" style="font-weight:500;letter-spacing:.2px;margin-top:4px">Feste Uhrzeiten im gewählten Zeitraum (Tagesziel ${S.waterGoalMl} ml).</div>`;
  if (!LN) rem += '<p class="t-sm">Hinweis: Mitteilungen gibt es nur in der installierten iPhone-App.</p>';
  h += sect('Erinnerungen') + card(rem);
  h += sect('Tagesziele & Schritte') + card(head('steps', C.sky, 'Tagesziele') + `<div class="wrap" style="gap:12px">${st('Wasser (ml)', String(S.waterGoalMl), 'waterGoalMl', 250)}${st('Kalorien (kcal)', String(S.kcalGoal), 'kcalGoal', 100)}${st('Protein (g)', String(S.proteinGoalG), 'proteinGoalG', 5)}${st('Schritte', String(S.stepGoal), 'stepGoal', 500)}</div>
    <p class="t-sm">Schritte werden auf dem iPhone manuell eingetragen – die App greift nicht auf Bewegungsdaten zu.</p>`);
  h += sect('Daten & Backup') + card(head('archive', C.mint, 'Backup') + `<p class="t-sm" style="font-size:14px">Alle Daten liegen nur auf diesem Gerät. Die App nutzt kein Internet und schickt nichts weg.</p>
    ${swRow('Automatisches Backup nach jedem Training', S.autoBackup, 'data-act="toggle" data-k="autoBackup"')}
    <div class="t-lab" style="white-space:pre-line">${META.lastAutoBackupAt > 0 ? `Letztes Backup: ${fmtDateTime(META.lastAutoBackupAt)}\n${esc(META.lastAutoBackupInfo)}` : 'Noch kein automatisches Backup.'}</div>
    <p class="t-sm">Das automatische Backup liegt im App-Speicher (die neuesten 3) und wird beim Löschen der App entfernt. Einen eigenen Backup-Ordner gibt es auf iOS nicht – für dauerhafte Kopien regelmäßig „JSON exportieren“ und z. B. in „Dateien“ sichern.</p>
    <hr><div class="row"><button class="btn f grow" data-act="export">JSON exportieren</button><button class="btn o grow" data-act="import">JSON importieren</button></div><p class="t-sm">Import liest auch Backups der Android-App (Version 1.0.0 und 1.0.1).</p>`);
  h += sect('Über') + card(`<div class="t-tm">Lumvero Fit ${VERSION}</div><p class="t-sm">Private Offline-Fitness-App. Eigener Code, eigene Grafiken und Icons. Open-Source-Bibliotheken: Capacitor und Capacitor-Plugins (MIT-Lizenz).</p>
    <p class="t-sm"><b>Datenschutz:</b> keine Konten, keine Werbung, keine Analyse, kein Netzwerkzugriff. Trainings, Körperdaten und Einstellungen bleiben auf diesem Gerät.</p><p class="t-sm">Hinweis: Keine medizinische Beratung. 1RM- und Erholungswerte sind Schätzungen.</p>`);
  return h + '</div>';
}
