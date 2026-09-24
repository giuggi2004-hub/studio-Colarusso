/* ==========================================================
   STUDIO COLARUSSO — interazioni
   Non serve modificare questo file: i contenuti sono in data/sito.js (gestiti da /admin/)
   ========================================================== */
(() => {
"use strict";

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer  = matchMedia("(hover: hover) and (pointer: fine)").matches;
const isPhone = !finePointer || innerWidth < 700;   // telefoni e tablet: effetti più leggeri
const INK = "#111111", PAPER = "#F9F8F6", RED = "#D32F2F";
const rand = (a, b) => a + Math.random() * (b - a);
const pad2 = n => String(n).padStart(2, "0");

/* ------------------------------------------------------------------
   1. CONTENUTI (da data/sito.js)
------------------------------------------------------------------ */
const SITO = window.SITO || {};
const OPERE = (SITO.opere || []).filter(o => !o.nascosta);
const SELEZIONE = SITO.selezione || [];
const CONTATTI = SITO.contatti || {};
const T = SITO.testi || {};
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const paras = (arr, firstClass) => arr.map((t, i) => `<p${i === 0 && firstClass ? ` class="${firstClass}"` : ""}>${esc(t)}</p>`).join("");
if (T.heroSottotitolo) $("#tHero").textContent = T.heroSottotitolo;
if (T.poeticaIntro) $("#tIntro").textContent = T.poeticaIntro;
if (T.citazione) $("#tQuote").textContent = `“${T.citazione}”`;
if (T.poetica1 && T.poetica1.length) $("#tP1").innerHTML = paras(T.poetica1);
if (T.poetica2 && T.poetica2.length) $("#tP2").innerHTML = paras(T.poetica2);
if (T.biografia && T.biografia.length) $("#tBio").innerHTML = paras(T.biografia, "bio-lead");
if (T.tappe && T.tappe.length) $("#tTappe").innerHTML = T.tappe.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join("");

const byN = n => OPERE.findIndex(o => o.n === n);
const meta = o => [o.tecnica, o.misure, o.anno].filter(Boolean).join(" · ");
const thumb = o => o.anteprima || o.foto;

// Apertura
const heroIdx = Math.max(0, byN(SITO.operaInApertura));
const heroO = OPERE[heroIdx];
$("#heroWork").innerHTML = `<img src="${heroO.foto}" alt="${esc(heroO.titolo)}, ${esc(heroO.tecnica)}" width="${heroO.w}" height="${heroO.h}" fetchpriority="high" decoding="async"><figcaption>${esc(heroO.titolo)}${heroO.anno ? ", " + heroO.anno : ""}</figcaption>`;
$("#heroWork").dataset.work = heroIdx;

// Selezione flottante
const floating = $("#floating");
floating.innerHTML = SELEZIONE.map(byN).filter(i => i > -1).map((i, k) => {
  const o = OPERE[i];
  return `<figure class="float reveal" data-work="${i}">
    <div class="frame" data-depth="${[14, 8, 20, 10, 16, 6][k % 6]}"><img src="${thumb(o)}" alt="${esc(o.titolo)}, ${esc(o.tecnica)}" width="${o.w}" height="${o.h}" loading="lazy" decoding="async"></div>
    <figcaption data-speed="${k % 2 ? 0.05 : -0.04}"><b>${esc(o.titolo)}</b><span>${pad2(k + 1)}</span></figcaption>
  </figure>`;
}).join("");

// Archivio
$("#archive").innerHTML = OPERE.map((o, i) => `
  <figure class="arch reveal" data-work="${i}">
    <div class="frame"><img src="${thumb(o)}" alt="${esc(o.titolo)}, ${esc(o.tecnica)}" width="${o.w}" height="${o.h}" loading="lazy" decoding="async"></div>
    <p><b>${esc(o.titolo)}</b><span>${o.anno || ""}</span></p>
  </figure>`).join("");
$("#countAll").textContent = OPERE.length;

// Contatti
const mail = $("#mailLink");
mail.href = "mailto:" + CONTATTI.email; mail.textContent = CONTATTI.email;
$$(".legal-mail").forEach(a => { a.href = "mailto:" + CONTATTI.email; a.textContent = CONTATTI.email; });
[["#igLink", "instagram"], ["#igLink2", "instagram"], ["#igLink3", "instagram"], ["#ttLink", "tiktok"], ["#ttLink2", "tiktok"], ["#ttLink3", "tiktok"]].forEach(([sel, k]) => {
  const a = $(sel); if (!a) return;
  if (CONTATTI[k]) a.href = CONTATTI[k]; else a.remove();
});
$("#year").textContent = new Date().getFullYear();

/* ------------------------------------------------------------------
   3. STRAPPO A TUTTO SCHERMO (apertura del sito e cambio sezione)
   Un foglio nero di manifesto si incolla sullo schermo (collage)
   e poi si strappa in due lungo un bordo irregolare (décollage).
------------------------------------------------------------------ */
const layer = $("#tearLayer");
const SVGNS = "http://www.w3.org/2000/svg";
let tearing = false;

function tearLine(w, h) {
  // linea di strappo quasi verticale, irregolare, con piccole fibre
  const x0 = w * rand(0.42, 0.62), x1 = w * rand(0.36, 0.58);
  const f1 = rand(1.5, 3), f2 = rand(5, 9), ph = rand(0, 6);
  const pts = [];
  for (let y = -60; y <= h + 60; y += isPhone ? rand(14, 26) : rand(7, 16)) {
    const t = (y + 60) / (h + 120);
    const x = x0 + (x1 - x0) * t
      + Math.sin(t * Math.PI * f1 + ph) * w * 0.035
      + Math.sin(t * Math.PI * f2 + ph * 2) * w * 0.012
      + rand(-5, 5);
    pts.push([x, y]);
  }
  return pts;
}
const P = pts => pts.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");

function buildSheet({ label = "", kicker = "Studio Colarusso", logoRect = null }) {
  const w = innerWidth, h = innerHeight, line = tearLine(w, h);
  const fiber = side => line.map(([x, y]) => [x + side * rand(3, 11), y]);
  const L = [[-80, -60], ...line, [-80, h + 60]];
  const R = [...line, [w + 80, h + 60], [w + 80, -60]];
  const LF = [[-80, -60], ...fiber(1), [-80, h + 60]];
  const RF = [...fiber(-1), [w + 80, h + 60], [w + 80, -60]];
  const content = logoRect
    ? `<image href="logo-chiaro.png" x="${logoRect.x}" y="${logoRect.y}" width="${logoRect.width}" height="${logoRect.height}"/>`
    : `<text x="${w / 2}" y="${h / 2}" text-anchor="middle" dominant-baseline="middle" fill="${PAPER}"
         font-family="Playfair Display, Georgia, serif" font-size="${Math.min(w * 0.13, 150)}" letter-spacing="-2">${label}</text>
       <line x1="${w / 2 - 24}" x2="${w / 2 + 24}" y1="${h / 2 + Math.min(w * 0.09, 100)}" y2="${h / 2 + Math.min(w * 0.09, 100)}" stroke="${RED}" stroke-width="1.5"/>
       <text x="${w / 2}" y="${h / 2 + Math.min(w * 0.09, 100) + 34}" text-anchor="middle" fill="#8d8a85"
         font-family="Jost, Arial, sans-serif" font-weight="300" font-size="11" letter-spacing="4.5">${kicker.toUpperCase()}</text>`;
  const id = "t" + Date.now();
  layer.innerHTML = `<svg xmlns="${SVGNS}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs>
      <clipPath id="${id}L"><polygon points="${P(L)}"/></clipPath>
      <clipPath id="${id}R"><polygon points="${P(R)}"/></clipPath>
    </defs>
    <g class="tear-piece" id="pieceL">
      <polygon points="${P(LF)}" fill="#EDE9E1"/>
      <g clip-path="url(#${id}L)"><rect x="-100" y="-100" width="${w + 200}" height="${h + 200}" fill="${INK}"/>${content}</g>
    </g>
    <g class="tear-piece" id="pieceR">
      <polygon points="${P(RF)}" fill="#EDE9E1"/>
      <g clip-path="url(#${id}R)"><rect x="-100" y="-100" width="${w + 200}" height="${h + 200}" fill="${INK}"/>${content}</g>
    </g>
  </svg>`;
  const pl = $("#pieceL", layer), pr = $("#pieceR", layer);
  pl.style.transformOrigin = `0px 0px`;
  pr.style.transformOrigin = `${w}px ${h}px`;
  return { pl, pr, w, h };
}

const OUT_L = (w, h) => `translate(${-w * 0.75}px, ${h * 0.08}px) rotate(-9deg)`;
const OUT_R = (w, h) => `translate(${w * 0.75}px, ${-h * 0.06}px) rotate(7deg)`;
const IN_L  = (w, h) => `translate(${-w * 0.7}px, ${-h * 0.05}px) rotate(4deg)`;
const IN_R  = (w, h) => `translate(${w * 0.7}px, ${h * 0.05}px) rotate(-4deg)`;
const SHADOW = isPhone ? "none" : "drop-shadow(0 30px 40px rgba(0,0,0,.28))";

function tearAway(sheet, dur = 1100) {
  const { pl, pr, w, h } = sheet;
  const opts = { duration: dur, easing: "cubic-bezier(.7,0,.25,1)", fill: "forwards" };
  pl.style.filter = pr.style.filter = SHADOW;
  const a = pl.animate([{ transform: "none" }, { transform: OUT_L(w, h) }], opts);
  pr.animate([{ transform: "none" }, { transform: OUT_R(w, h) }], { ...opts, delay: 60 });
  return a.finished.then(() => new Promise(r => setTimeout(r, 80))).then(() => {
    layer.innerHTML = ""; layer.classList.remove("active");
  });
}

function glueIn(sheet, dur = 620) {
  const { pl, pr, w, h } = sheet;
  pl.style.filter = pr.style.filter = SHADOW;
  const opts = { duration: dur, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" };
  pl.animate([{ transform: IN_L(w, h) }, { transform: "none" }], opts);
  return pr.animate([{ transform: IN_R(w, h) }, { transform: "none" }], opts).finished
    .then(() => { pl.style.filter = pr.style.filter = "none"; });
}

function tearTransition(label, onCovered) {
  if (reduceMotion || tearing) { onCovered(); return; }
  tearing = true;
  layer.classList.add("active");
  const sheet = buildSheet({ label });
  glueIn(sheet)
    .then(() => { onCovered(); return new Promise(r => setTimeout(r, 220)); })
    .then(() => tearAway(sheet))
    .then(() => { tearing = false; });
}

// Apertura del sito
function openIntro() {
  const intro = $("#intro"), logo = $(".intro-logo", intro);
  if (reduceMotion) { intro.remove(); document.body.classList.remove("is-loading"); return; }
  const r = logo.getBoundingClientRect();
  layer.classList.add("active");
  const sheet = buildSheet({ logoRect: { x: r.left, y: r.top, width: r.width, height: r.height } });
  intro.remove();
  document.body.classList.remove("is-loading");
  tearAway(sheet, 1300);
}
const introReady = Promise.all([
  new Promise(r => setTimeout(r, 1500)),
  new Promise(r => (document.readyState === "complete" ? r() : addEventListener("load", r))).then(() => document.fonts && document.fonts.ready)
]);
introReady.then(openIntro);
setTimeout(() => { if ($("#intro")) openIntro(); }, 5000); // sicurezza su connessioni lente

// Navigazione tra le sezioni con lo strappo
$$("a[data-tear]").forEach(a => a.addEventListener("click", e => {
  const id = a.getAttribute("href");
  const target = id && $(id);
  if (!target) return;
  e.preventDefault();
  closeMenu();
  const label = id === "#inizio" ? "Colarusso" : (target.querySelector(".sec-title")?.textContent || "");
  tearTransition(label, () => {
    if (!$("#viewer").hidden) closeViewer(true);
    window.scrollTo(0, id === "#inizio" ? 0 : target.getBoundingClientRect().top + scrollY - (target.matches("section") ? 0 : 100));
    history.replaceState(null, "", id);
  });
}));

/* ------------------------------------------------------------------
   5. CURSORE PERSONALIZZATO
------------------------------------------------------------------ */
const cur = $("#cursor");
let mx = innerWidth / 2, my = innerHeight / 2, cxp = mx, cyp = my;
if (finePointer) {
  document.documentElement.classList.add("has-cursor");
  addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    const t = e.target;
    const inStage = t.closest && t.closest("#stage") && t.id === "vImg";
    cur.classList.toggle("is-lens", !!inStage);
    cur.classList.toggle("is-work", !inStage && !!(t.closest && t.closest("[data-work]")));
    cur.classList.toggle("is-link", !!(t.closest && t.closest("a, button, select, input, textarea, label")) && !t.closest("[data-work]"));
    cur.classList.toggle("is-dark", !!(t.closest && t.closest(".poetics")));
  }, { passive: true });
  document.addEventListener("mouseleave", () => (cur.style.opacity = 0));
  document.addEventListener("mouseenter", () => (cur.style.opacity = 1));
}

/* ------------------------------------------------------------------
   6. PARALLASSE — al movimento del mouse e allo scroll
------------------------------------------------------------------ */
const depthEls = $$("[data-depth]"), speedEls = $$("[data-speed]");
function loop() {
  // cursore
  cxp += (mx - cxp) * 0.22; cyp += (my - cyp) * 0.22;
  if (finePointer) cur.style.transform = `translate(${cxp}px, ${cyp}px)`;
  if (!reduceMotion) {
    const nx = mx / innerWidth - 0.5, ny = my / innerHeight - 0.5, vh = innerHeight;
    for (const el of depthEls) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      const d = +el.dataset.depth;
      el.style.transform = `translate3d(${(-nx * d).toFixed(2)}px, ${(-ny * d).toFixed(2)}px, 0)`;
    }
    for (const el of speedEls) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const off = (r.top + r.height / 2 - vh / 2) * +el.dataset.speed;
      el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
    }
  }
  requestAnimationFrame(loop);
}
if (finePointer) requestAnimationFrame(loop);   // su telefono niente parallasse: pagina più fluida

/* ------------------------------------------------------------------
   7. VISTA A SCHERMO INTERO + LENTE D'INGRANDIMENTO
------------------------------------------------------------------ */
const viewer = $("#viewer"), vImg = $("#vImg"), lens = $("#lens"), stage = $("#stage");
const ZOOM = 2.6;
let cur_i = 0, lastFocus = null;

function fillViewer(i) {
  cur_i = (i + OPERE.length) % OPERE.length;
  const o = OPERE[cur_i];
  vImg.classList.remove("ready");
  vImg.onload = () => requestAnimationFrame(() => vImg.classList.add("ready"));
  vImg.src = o.foto; vImg.alt = `${o.titolo}, ${o.tecnica}`;
  if (vImg.complete) requestAnimationFrame(() => vImg.classList.add("ready"));
  lens.style.backgroundImage = `url("${o.foto}")`;
  $("#vCount").textContent = `${pad2(cur_i + 1)} / ${pad2(OPERE.length)}`;
  $("#vTitle").textContent = o.titolo;
  $("#vDesc").textContent = o.descrizione || ""; $("#vDesc").hidden = !o.descrizione;
  $("#vData").innerHTML = [["Tecnica", o.tecnica], ["Misure", o.misure], ["Anno", o.anno]]
    .filter(r => r[1]).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("") + `<dt>Opera</dt><dd>Pezzo unico</dd>`;
  const gb = $("#vGenBtn"), g = $("#vGen");
  gb.hidden = !o.genesi; g.textContent = o.genesi || "";
  gb.classList.remove("open"); g.classList.remove("open");
  resetZoom(false);
  [cur_i + 1, cur_i - 1].forEach(k => { const n = OPERE[(k + OPERE.length) % OPERE.length]; if (n) new Image().src = n.foto; });
}
function openViewer(i) {
  lastFocus = document.activeElement;
  fillViewer(i);
  viewer.hidden = false;
  viewer.scrollTop = 0;
  document.body.style.overflow = "hidden";
  if (!finePointer) { const h = $("#vTouchHint"); h.classList.remove("go"); void h.offsetWidth; h.classList.add("go"); }
  $("#vClose").focus({ preventScroll: true });
}
function closeViewer(silent) {
  viewer.hidden = true;
  lens.classList.remove("on");
  document.body.style.overflow = "";
  if (!silent && lastFocus) lastFocus.focus({ preventScroll: true });
}
document.addEventListener("click", e => {
  const w = e.target.closest("[data-work]");
  if (w) openViewer(+w.dataset.work);
});
$("#vClose").onclick = () => closeViewer();
$("#vPrev").onclick = () => fillViewer(cur_i - 1);
$("#vNext").onclick = () => fillViewer(cur_i + 1);
$("#vPrevM").onclick = () => fillViewer(cur_i - 1);
$("#vNextM").onclick = () => fillViewer(cur_i + 1);
$("#vAskM").onclick = () => $("#vAsk").click();
$("#vGenBtn").onclick = e => { e.currentTarget.classList.toggle("open"); $("#vGen").classList.toggle("open"); };
document.addEventListener("keydown", e => {
  if (viewer.hidden) return;
  if (e.key === "Escape") closeViewer();
  if (e.key === "ArrowRight") fillViewer(cur_i + 1);
  if (e.key === "ArrowLeft") fillViewer(cur_i - 1);
});
// "Chiedi informazioni" su un'opera
$("#vAsk").addEventListener("click", e => {
  e.preventDefault();
  const o = OPERE[cur_i];
  tearTransition("Contatti", () => {
    closeViewer(true);
    const f = $("#form");
    f.motivo.value = "Informazioni su un'opera";
    f.opera.value = `${o.titolo} (n. ${o.n})`;
    f.messaggio.value = `Buongiorno, vorrei ricevere informazioni sull'opera "${o.titolo}" (n. ${o.n}).`;
    window.scrollTo(0, $("#contatti").getBoundingClientRect().top + scrollY);
  });
});
// Lente: mostra la materia strappata da vicino
if (finePointer) {
  vImg.addEventListener("mousemove", e => {
    const r = vImg.getBoundingClientRect(), s = stage.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top, L = lens.offsetWidth;
    lens.style.left = (e.clientX - s.left - L / 2) + "px";
    lens.style.top  = (e.clientY - s.top - L / 2) + "px";
    lens.style.backgroundSize = `${r.width * ZOOM}px ${r.height * ZOOM}px`;
    lens.style.backgroundPosition = `${-(px * ZOOM - L / 2)}px ${-(py * ZOOM - L / 2)}px`;
    lens.classList.add("on");
  });
  vImg.addEventListener("mouseleave", () => lens.classList.remove("on"));
}

/* ------------------------------------------------------------------
   7b. TELEFONO: PIZZICA PER INGRANDIRE, TRASCINA, SCORRI TRA LE OPERE
------------------------------------------------------------------ */
const zoomEl = $("#zoom");
let zs = 1, zx = 0, zy = 0;
function applyZoom(anim) {
  zoomEl.style.transition = anim ? "transform .35s cubic-bezier(.16,1,.3,1)" : "none";
  zoomEl.style.transform = `translate3d(${zx}px, ${zy}px, 0) scale(${zs})`;
}
function resetZoom(anim = true) { zs = 1; zx = 0; zy = 0; applyZoom(anim); }
function clampPan() {
  const r = vImg.getBoundingClientRect(), w = r.width / zs, h = r.height / zs;
  const mx = Math.max(0, (w * zs - w) / 2 + 20), my = Math.max(0, (h * zs - h) / 2 + 20);
  zx = Math.max(-mx, Math.min(mx, zx)); zy = Math.max(-my, Math.min(my, zy));
}
if (!finePointer) {
  const pts = new Map();
  let start = null, lastTap = 0, swipeDx = 0;
  const center = () => { const r = stage.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  const snapshot = () => {
    const [a, b] = [...pts.values()];
    const c = center();
    if (b) return { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2 - c.x, my: (a.y + b.y) / 2 - c.y, s: zs, x: zx, y: zy, two: true };
    return { px: a.x, py: a.y, s: zs, x: zx, y: zy, two: false };
  };
  stage.addEventListener("pointerdown", e => {
    stage.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    start = snapshot(); swipeDx = 0;
  });
  stage.addEventListener("pointermove", e => {
    if (!pts.has(e.pointerId) || !start) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const now = snapshot();
    if (start.two && now.two) {
      zs = Math.max(1, Math.min(5, start.s * now.d / start.d));
      const k = zs / start.s;
      zx = now.mx - (start.mx - start.x) * k; zy = now.my - (start.my - start.y) * k;
      clampPan(); applyZoom(false);
    } else if (!start.two && !now.two) {
      const dx = now.px - start.px, dy = now.py - start.py;
      if (zs > 1.02) { zx = start.x + dx; zy = start.y + dy; clampPan(); applyZoom(false); }
      else { swipeDx = dx; zx = dx * 0.5; zy = 0; applyZoom(false); }
    }
  });
  const end = e => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (pts.size) { start = snapshot(); return; }
    if (zs <= 1.02) {
      if (Math.abs(swipeDx) > 60) { fillViewer(cur_i + (swipeDx < 0 ? 1 : -1)); }
      else {
        const t = Date.now();
        if (t - lastTap < 300 && Math.abs(swipeDx) < 10) {   // doppio tocco: ingrandisci lì
          const c = center(); zs = 2.5; zx = -(e.clientX - c.x) * 1.5; zy = -(e.clientY - c.y) * 1.5; clampPan(); applyZoom(true); lastTap = 0; return;
        }
        lastTap = t; resetZoom(true);
      }
    } else if (Date.now() - lastTap < 300) { resetZoom(true); lastTap = 0; }
    else lastTap = Date.now();
    start = null;
  };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);
}

/* ------------------------------------------------------------------
   7c. ARCHIVIO: CAROSELLO SU TELEFONO (contatore e barra)
------------------------------------------------------------------ */
const archive = $("#archive"), archBar = $("#archBar"), archCount = $("#archCount");
let archTick = false;
function archUpdate() {
  archTick = false;
  const max = archive.scrollWidth - archive.clientWidth;
  if (max <= 0) return;
  const p = archive.scrollLeft / max;
  archBar.style.setProperty("--p", Math.max(0.04, p));
  const first = archive.firstElementChild, step = first ? first.getBoundingClientRect().width + 14 : 1;
  archCount.textContent = `${pad2(Math.min(OPERE.length, Math.round(archive.scrollLeft / step) + 1))} / ${pad2(OPERE.length)}`;
}
archive.addEventListener("scroll", () => { if (!archTick) { archTick = true; requestAnimationFrame(archUpdate); } }, { passive: true });
addEventListener("resize", archUpdate); archUpdate();

/* ------------------------------------------------------------------
   8. MENU, HEADER, COMPARSA DEGLI ELEMENTI
------------------------------------------------------------------ */
const burger = $("#burger"), links = $("#navLinks");
function closeMenu() { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); document.documentElement.classList.remove("menu-open"); }
burger.onclick = () => {
  const o = links.classList.toggle("open");
  burger.setAttribute("aria-expanded", o);
  burger.setAttribute("aria-label", o ? "Chiudi il menu" : "Apri il menu");
  document.documentElement.classList.toggle("menu-open", o);
};
const nav = $("#nav");
const toTop = $("#toTop");
const onScroll = () => {
  nav.classList.toggle("solid", scrollY > 40);
  toTop.classList.toggle("show", scrollY > innerHeight * 1.2);
};
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
addEventListener("scroll", onScroll, { passive: true }); onScroll();

const io = new IntersectionObserver(es => es.forEach(x => {
  if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); }
}), { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
$$(".reveal").forEach(el => io.observe(el));

const secIO = new IntersectionObserver(es => es.forEach(x => {
  if (x.isIntersecting) $$(".nav-links a").forEach(a => a.classList.toggle("current", a.getAttribute("href") === "#" + x.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach(s => secIO.observe(s));

/* ------------------------------------------------------------------
   9. MODULO CONTATTI — apre il programma di posta con il messaggio pronto
------------------------------------------------------------------ */
$("#form").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.currentTarget, msg = $("#formMsg"), btn = f.querySelector("button[type=submit]");
  const data = { opera: f.opera.value, nome: f.nome.value, email: f.email.value, motivo: f.motivo.value, messaggio: f.messaggio.value, consenso: f.consenso.checked, sito_web: f.sito_web.value };
  btn.disabled = true; msg.style.color = ""; msg.textContent = "Invio in corso…";
  try {
    const r = await fetch("/api/contatti", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "Invio non riuscito");
    f.reset();
    msg.style.color = "var(--ink)";
    msg.textContent = "Grazie, il messaggio è stato inviato. Ti risponderemo al più presto.";
  } catch (err) {
    // se il sito è aperto dal computer (senza server) o l'invio fallisce, apre il programma di posta
    if (location.protocol === "file:" || err instanceof TypeError) {
      const subject = `[Studio Colarusso] ${data.motivo} — ${data.nome}`;
      location.href = `mailto:${CONTATTI.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(data.messaggio + "\n\n" + data.nome + "\n" + data.email)}`;
      msg.textContent = "Si sta aprendo il tuo programma di posta con il messaggio già pronto.";
    } else msg.textContent = err.message;
  } finally { btn.disabled = false; }
});

/* ------------------------------------------------------------------
   10. TESTI LEGALI
------------------------------------------------------------------ */
const legal = $("#legal");
$$(".upd").forEach(el => (el.textContent = "24 settembre 2026"));
function openLegal(doc) {
  $$("article", legal).forEach(a => (a.hidden = a.dataset.doc !== doc));
  legal.hidden = false; document.body.style.overflow = "hidden";
  legal.scrollTop = 0; $("#legalClose").focus({ preventScroll: true });
}
function closeLegal() { legal.hidden = true; document.body.style.overflow = ""; }
$$("[data-legal]").forEach(b => b.addEventListener("click", () => openLegal(b.dataset.legal)));
$("#legalClose").onclick = closeLegal;
legal.addEventListener("click", e => { if (e.target === legal) closeLegal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !legal.hidden) closeLegal(); });
if (location.hash === "#privacy") openLegal("privacy");
})();
