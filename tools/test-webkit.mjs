// WebKit-Rauchtest (iPhone-15-Viewport) gegen laufenden serve.mjs auf Port 5120.
// Aufruf: node tools/test-webkit.mjs   (Playwright aus test1/boardgames/tools/webkit-test)
import path from 'node:path';
import fs from 'node:fs';
const PW = 'file:///C:/Users/Andrej/projekte/test1/boardgames/tools/webkit-test/node_modules/playwright/index.mjs';
const { webkit, devices } = await import(PW);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const SHOTS = path.join(ROOT, 'docs', 'screens');
fs.mkdirSync(SHOTS, { recursive: true });
const URL0 = 'http://localhost:5120/';

const browser = await webkit.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], locale: 'de-DE', acceptDownloads: true });
const page = await ctx.newPage();
const errors = [], notFound = [];
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('CONSOLE ' + m.text()); });
page.on('response', (r) => { if (r.status() >= 400) notFound.push(r.url()); });
const results = [];
const ok = (name, cond, extra = '') => { results.push(`${cond ? 'OK  ' : 'FEHL'} ${name}${extra ? ' – ' + extra : ''}`); };
const shot = (n) => page.screenshot({ path: path.join(SHOTS, n + '.png') });
const ev = (f, a) => page.evaluate(f, a);
const tap = async (sel) => { await page.locator(sel).first().click(); await page.waitForTimeout(250); };

await page.goto(URL0);
await page.waitForTimeout(800);
ok('Seed: 79 Übungen, 16 Pläne', await ev(() => LFApp.db.exercises.length === 79 && LFApp.db.plans.length === 16), await ev(() => `${LFApp.db.exercises.length}/${LFApp.db.plans.length}/${LFApp.db.planExercises.length}`));
await shot('01-heute');
await tap('[data-act=water][data-v="250"]');
ok('Wasser +250 auf Heute', await ev(() => LFApp.db.water.length === 1 && LFApp.db.water[0].ml === 250));

// Tabs rendern
for (const [t, n] of [['training', '02-training'], ['timer', '06-timer'], ['body', '08-koerper'], ['progress', '09-fortschritt-uebersicht']]) {
  await tap(`#tabs [data-go=${t}]`);
  ok('Tab ' + t + ' rendert', await ev((x) => LFApp.stack[0].n === x && document.querySelector('#app').innerText.length > 50, t));
  if (t === 'training') await shot(n);
}
await tap('#tabs [data-go=training]');
await tap('[data-go=library]');
await shot('03-bibliothek');
await page.locator('[data-f=libq]').fill('bank');
await page.waitForTimeout(200);
ok('Bibliothek-Suche filtert', await ev(() => document.querySelectorAll('#libList .exrow').length > 0 && document.querySelectorAll('#libList .exrow').length < 20));
await tap('#libList .exrow');
await page.waitForTimeout(400);
await shot('04-uebung-detail');
await tap('[data-back]'); await tap('[data-back]');

// Plan-Editor
const gkA = await ev(() => LFApp.db.plans.find((p) => p.name === 'Ganzkörper A').id);
await tap(`[data-act=plan-menu][data-id="${gkA}"]`);
await tap('[data-act=m-edit]');
await shot('05-plan-editor');
ok('Plan-Editor zeigt 5 Übungen', await ev(() => document.querySelectorAll('[data-act=pe-del]').length === 5));
await tap('[data-back]');

// Workout
await tap(`[data-act=start-plan][data-id="${gkA}"]`);
ok('Workout gestartet', await ev(() => LFApp.stack.at(-1).n === 'workout' && LFApp.db.sessions.length === 1));
const sq = await ev(() => LFApp.db.exercises.find((e) => e.seedKey === 'squat_bb').id);
const B = `[data-block="${sq}"]`;
for (let i = 0; i < 4; i++) await tap(`${B} [data-act=w-plus]`);
await tap(`${B} [data-act=r-plus]`);
ok('Stepper Gewicht/Wdh.', await ev((s) => document.querySelector(`[data-block="${s}"] .stp .v`).textContent.trim() === '10', sq), await ev((s) => document.querySelector(`[data-block="${s}"] .stp .v`).textContent, sq));
await tap(`${B} [data-act=log]`);
ok('Satz 1 gespeichert', await ev(() => LFApp.db.sets.length === 1 && LFApp.db.sets[0].weightKg === 10 && LFApp.db.sets[0].reps === 6), await ev(() => JSON.stringify(LFApp.db.sets[0])));
ok('Pause läuft (Banner)', await ev(() => !!document.querySelector('[data-live=rest-time]') && LFApp.TM.snap && LFApp.TM.snap.kind === 'REST'));
const t1 = await ev(() => document.querySelector('[data-live=rest-time]').textContent);
await page.waitForTimeout(2200);
const t2 = await ev(() => document.querySelector('[data-live=rest-time]').textContent);
ok('Pausen-Countdown zählt runter', t1 !== t2, `${t1} -> ${t2}`);
await tap('[data-act=rest-plus]');
await shot('07-workout');
await tap(`${B} [data-act=stype][data-v=WARMUP]`);
await tap(`${B} [data-act=log]`);
await tap(`${B} [data-act=stype][data-v=NORMAL]`);
await tap(`${B} [data-act=rpe][data-v="8"]`);
await tap(`${B} [data-act=log]`);
ok('3 Sätze geloggt (inkl. Aufwärmsatz, RPE)', await ev(() => LFApp.db.sets.length === 3 && LFApp.db.sets[1].setType === 'WARMUP' && LFApp.db.sets[2].rpe === 8), await ev(() => JSON.stringify(LFApp.db.sets.map((s) => [s.setType, s.rpe]))));
await tap(`${B} [data-act=cycle]`);
ok('Satzart per Tippen gewechselt', await ev(() => LFApp.db.sets[0].setType === 'WARMUP'));
await tap(`${B} [data-act=cycle]`); await tap(`${B} [data-act=cycle]`); await tap(`${B} [data-act=cycle]`);
ok('Satzart rundum zurück auf NORMAL', await ev(() => LFApp.db.sets[0].setType === 'NORMAL'));
await tap(`${B} [data-act=ex-menu]`);
await tap('[data-act=m-plates]');
await page.locator('[data-f=plate]').fill('100');
await page.waitForTimeout(200);
ok('Scheibenrechner 100 kg = 25+15', await ev(() => document.querySelector('#plateOut').innerText.includes('25 + 15')), await ev(() => document.querySelector('#plateOut').innerText.replace(/\n/g, ' ')));
await shot('07b-scheibenrechner');
await tap('[data-act=dlg-close]');
await tap(`${B} [data-act=ex-menu]`);
await tap('[data-act=m-warmup]');
ok('Aufwärm-Dialog', await ev(() => !!document.querySelector('.dlg')));
await tap('[data-act=dlg-done]');
await tap('[data-act=rest-skip]');
ok('Pause übersprungen', await ev(() => !LFApp.TM.snap));
await tap('.top [data-act=finish]');
ok('Beenden-Dialog Text', await ev(() => document.querySelector('.dlg').innerText.includes('2 Arbeitssätze und 1 Aufwärmsatz werden gespeichert.')), await ev(() => document.querySelector('.dlg p').innerText));
await tap('[data-act=dlg-finish-ok]');
ok('Session-Detail nach Beenden', await ev(() => LFApp.stack.at(-1).n === 'session' && LFApp.db.sessions[0].endedAt != null));
await shot('07c-session-detail');
await tap('[data-back]');

// Körper
await tap('#tabs [data-go=body]');
await page.locator('[data-f=weight]').fill('82,5');
await tap('[data-act=save-weight]');
ok('Körpergewicht eingetragen', await ev(() => LFApp.db.bodyWeights.length === 1 && LFApp.db.bodyWeights[0].weightKg === 82.5), await ev(() => JSON.stringify(LFApp.db.bodyWeights)));
await page.locator('[data-f=weight]').fill('500');
await tap('[data-act=save-weight]');
ok('Gewicht 500 abgelehnt mit Meldung', await ev(() => LFApp.db.bodyWeights.length === 1 && document.body.innerText.includes('Bitte ein Gewicht zwischen 20 kg und 400 kg eingeben')));
await page.locator('[data-f=weight]').fill('');
await tap('.watercard [data-act=water][data-v="500"]');
ok('Wasser +500 im Körper-Tab', await ev(() => LFApp.db.water.reduce((a, w) => a + w.ml, 0) === 750));
await tap('[data-act=m-kind][data-v="Taille"]');
await page.locator('[data-f=measure]').fill('84');
await tap('[data-act=save-measure]');
ok('Körpermaß gespeichert', await ev(() => LFApp.db.measurements.length === 1));
await tap('[data-act=food][data-v="4"]');
ok('Ernährung Quick-Add', await ev(() => LFApp.db.nutrition.length === 1 && LFApp.db.nutrition[0].proteinG === 25));
await ev(() => window.scrollTo(0, 0));
await shot('08-koerper');

// Timer
await tap('#tabs [data-go=timer]');
await tap('[data-act=preset][data-v="0"]');
await tap('[data-act=t-start]');
await page.waitForTimeout(2300);
ok('Timer läuft (Vorlauf)', await ev(() => LFApp.TM.snap && LFApp.TM.snap.kind === 'INTERVAL' && document.querySelector('[data-live=t-phase]').textContent.includes('los')), await ev(() => document.querySelector('[data-live=t-time]').textContent));
await shot('06-timer');
await tap('[data-act=t-pause]');
const p1 = await ev(() => document.querySelector('[data-live=t-time]').textContent);
await page.waitForTimeout(1500);
ok('Timer pausiert (Zeit steht)', await ev((p) => LFApp.TM.snap.pausedAt != null && document.querySelector('[data-live=t-time]').textContent === p, p1));
await tap('[data-act=t-resume]');
await tap('[data-act=t-skip]');
ok('Überspringen -> Arbeit', await ev(() => document.querySelector('[data-live=t-phase]').textContent === 'Arbeit'));
await tap('[data-act=t-stop]');
ok('Timer gestoppt', await ev(() => !LFApp.TM.snap && !!document.querySelector('[data-act=t-start]')));

// Fortschritt
await tap('#tabs [data-go=progress]');
await shot('09-fortschritt-uebersicht');
const names = ['', '10-fortschritt-kalender', '11-fortschritt-rekorde', '12-fortschritt-verlauf'];
for (let i = 1; i <= 3; i++) { await tap(`[data-act=ptab][data-v="${i}"]`); await shot(names[i]); }
ok('Verlauf zeigt 1 Training', await ev(() => document.querySelectorAll('[data-act=open-session]').length === 1));

// Einstellungen
await tap('#tabs [data-go=today]');
await shot('01-heute');
await tap('[data-go=settings]');
await shot('13-einstellungen');
await tap('[data-act=set][data-v=LIGHT]');
ok('Hell-Design', await ev(() => document.documentElement.dataset.theme === 'light'));
await tap('[data-back]');
await shot('14-heute-hell');
await tap('[data-go=settings]');
await tap('[data-act=set][data-v=DARK]');

// Backup-Rundlauf
const before = await ev(() => { const d = LFApp.exportData(); delete d.exportedAt; return JSON.stringify(d); });
const text = await ev(() => LFApp.encodeBackup(LFApp.exportData()));
const dl = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
await tap('[data-act=export]');
const download = await dl;
ok('Export-Download im Browser', !!download, download ? download.suggestedFilename() : '');
await tap('[data-act=dlg-ok]');
await ev(() => { LFApp.db.water.push({ id: 999, epochDay: 1, ml: 1, createdAt: 1 }); LFApp.db.sets.length = 0; });
await ev((t) => LFApp.importText(t), text);
await tap('[data-act=dlg-import-ok]');
await page.waitForTimeout(200);
const after = await ev(() => { const d = LFApp.exportData(); delete d.exportedAt; return JSON.stringify(d); });
ok('Backup Export/Import identisch', before === after, `${before.length} Zeichen`);
await tap('[data-act=dlg-ok]');
const parsed = JSON.parse(text);
ok('Backup-Format', parsed.format === 'lumvero-fit-backup' && parsed.version === 2 && parsed.settings.unit === 'KG' && 'stepCounts' in parsed && parsed.sets[0].setType !== undefined);
const bad = await ev(() => { try { LFApp.decodeBackup(JSON.stringify({ format: 'lumvero-fit-backup', version: 2, sets: [{ id: 1, sessionId: 5, exerciseId: 1, setIndex: 1, weightKg: 1, reps: 1, createdAt: 1 }] })); return 'kein Fehler'; } catch (e) { return e.message; } });
ok('Import-Validierung (fehlende Referenz)', bad.startsWith('Satz 1 verweist'), bad);
const bad2 = await ev(() => { try { LFApp.decodeBackup('{"format":"x"}'); return 'kein Fehler'; } catch (e) { return e.message; } });
ok('Import-Validierung (Format)', bad2 === 'Unbekanntes Format: x', bad2);

// PR-Feier: zweites Training mit mehr Gewicht
await tap('[data-back]');
await tap('#tabs [data-go=training]');
await tap(`[data-act=start-plan][data-id="${gkA}"]`);
const B2 = `[data-block="${sq}"]`;
await tap(`${B2} [data-act=w-plus]`);
await tap(`${B2} [data-act=log]`);
ok('Rekord-Feier erscheint', await ev(() => !!document.querySelector('#pr .prc')), await ev(() => (document.querySelector('#pr') || {}).innerText || ''));
await shot('07d-rekord');
await page.waitForTimeout(3000);
await tap('[data-act=rest-skip]');
await tap('[data-act=wo-menu]');
await tap('[data-act=m-discard]');
await tap('[data-act=dlg-discard-ok]');
ok('Training verworfen', await ev(() => LFApp.db.sessions.length === 1 && !LFApp.db.sessions.some((s) => s.endedAt == null)));

const unexpected404 = notFound.filter((u) => !/capacitor\.js$/.test(u));
ok('Keine Fehler (pageerror/console)', errors.length === 0, errors.join(' | '));
ok('Keine fehlenden Dateien außer capacitor.js', unexpected404.length === 0, unexpected404.join(' '));
console.log(results.join('\n'));
console.log(`\n${results.filter((r) => r.startsWith('OK')).length}/${results.length} bestanden. 404 (erwartet im Browser): ${notFound.filter((u) => /capacitor\.js$/.test(u)).length}x capacitor.js`);
await browser.close();
