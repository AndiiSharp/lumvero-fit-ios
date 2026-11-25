// Lumvero-Fit-Rundgang: Heute, Wasser, Plan "Ganzkoerper A" starten, Saetze loggen (Stepper), Pause, Scheibenrechner,
// Training beenden -> Detail, Tabata-Timer, Koerpergewicht, Fortschritt-Tabs, Einstellungen, zurueck zu Heute.
(function () {
  const D = window.DEMO;
  const app = () => window.LFApp;
  const planId = () => { const p = app().db.plans.find((x) => x.name === 'Ganzkörper A') || app().db.plans[0]; return p.id; };
  const squat = () => { const e = app().db.exercises.find((x) => x.seedKey === 'squat_bb'); return e ? e.id : 1; };
  const blk = (s) => `[data-block="${squat()}"] ${s}`;
  const tapBlk = (s, opt) => () => D.tap(blk(s), opt);
  const skipRest = async () => { if (document.querySelector('[data-act=rest-skip]')) await D.tap('[data-act=rest-skip]', { after: 900 }); };
  D.run([
    () => D.wait(1500),
    () => D.scroll(700), () => D.scroll(-700),
    () => D.tap('[data-act=water][data-v="250"]', { after: 1600 }),
    () => D.tap('#tabs [data-go=training]', { after: 1800 }),
    async () => { if (app().db.sessions.some((s) => s.endedAt == null)) await D.tap('[data-act=open-active]', { after: 1500 }); else await D.tap(`[data-act=start-plan][data-id="${planId()}"]`, { after: 1800 }); },
    tapBlk('[data-act=w-plus]', { after: 450 }), tapBlk('[data-act=w-plus]', { after: 450 }), tapBlk('[data-act=w-plus]', { after: 450 }), tapBlk('[data-act=w-plus]', { after: 700 }),
    tapBlk('[data-act=r-plus]', { after: 900 }),
    tapBlk('[data-act=log]', { after: 3000 }),
    () => D.tap('[data-act=rest-plus]', { after: 1500 }),
    () => D.tap('[data-act=rest-skip]', { after: 1200 }),
    tapBlk('[data-act=w-plus]', { after: 700 }),
    tapBlk('[data-act=rpe][data-v="8"]', { after: 900 }),
    tapBlk('[data-act=log]', { after: 2200 }),
    skipRest,
    tapBlk('[data-act=stype][data-v=DROP]', { after: 900 }),
    tapBlk('[data-act=log]', { after: 1800 }),
    skipRest,
    () => { window.scrollTo({ top: 0, behavior: 'smooth' }); return D.wait(800); },
    tapBlk('[data-act=ex-menu]', { after: 900 }),
    () => D.tap('[data-act=m-plates]', { after: 3000 }),
    () => D.tap('[data-act=dlg-close]', { after: 1000 }),
    () => D.tap('.top [data-act=finish]', { after: 2000 }),
    () => D.tap('[data-act=dlg-finish-ok]', { after: 3500 }),
    () => D.tap('[data-back]', { after: 1200 }),
    () => D.tap('#tabs [data-go=timer]', { after: 1300 }),
    () => D.tap('[data-act=preset][data-v="0"]', { after: 900 }),
    () => D.tap('[data-act=t-start]', { after: 5500 }),
    () => D.tap('[data-act=t-pause]', { after: 1800 }),
    () => D.tap('[data-act=t-stop]', { after: 1300 }),
    () => D.tap('#tabs [data-go=body]', { after: 1300 }),
    () => D.type('[data-f=weight]', '82.5', { after: 600 }),
    () => D.tap('[data-act=save-weight]', { after: 1800 }),
    () => D.scroll(700), () => D.scroll(-700),
    () => D.tap('#tabs [data-go=progress]', { after: 2500 }),
    () => D.tap('[data-act=ptab][data-v="1"]', { after: 1500 }),
    () => D.tap('[data-act=ptab][data-v="2"]', { after: 1500 }),
    () => D.tap('[data-act=ptab][data-v="3"]', { after: 1500 }),
    () => D.tap('[data-act=ptab][data-v="0"]', { after: 1200 }),
    () => D.tap('#tabs [data-go=today]', { after: 1300 }),
    () => D.tap('[data-go=settings]', { after: 1500 }),
    () => D.scroll(700), () => D.scroll(-700),
    () => D.tap('[data-back]', { after: 2000 }),
  ]);
})();
