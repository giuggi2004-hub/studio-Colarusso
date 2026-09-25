/* ==========================================================
   STUDIO COLARUSSO — interazioni
   I contenuti sono in data/sito.js
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

// Faretto da quadro (visto di fronte): piastra a muro, due bracci, barra in nichel spazzolato
const LAMP_SVG = `<svg viewBox="0 0 400 96" aria-hidden="true">
  <defs>
    <linearGradient id="lmBar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9a9994"/><stop offset=".08" stop-color="#d9d8d4"/><stop offset=".22" stop-color="#f6f5f2"/>
      <stop offset=".34" stop-color="#e2e1dd"/><stop offset=".55" stop-color="#bebdb8"/><stop offset=".78" stop-color="#9c9b96"/>
      <stop offset=".93" stop-color="#7a7975"/><stop offset="1" stop-color="#63625e"/>
    </linearGradient>
    <linearGradient id="lmCap" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8e8d88"/><stop offset=".5" stop-color="#cfcec9"/><stop offset="1" stop-color="#a3a29d"/>
    </linearGradient>
    <linearGradient id="lmPlate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f1f0ed"/><stop offset=".5" stop-color="#d4d3cf"/><stop offset="1" stop-color="#aeada8"/>
    </linearGradient>
    <linearGradient id="lmPlateSide" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/>
    </linearGradient>
    <linearGradient id="lmCyl" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8f8e89"/><stop offset=".3" stop-color="#f3f2ef"/><stop offset=".6" stop-color="#c3c2bd"/><stop offset="1" stop-color="#7b7a75"/>
    </linearGradient>
    <linearGradient id="lmArm" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8d8c87"/><stop offset=".45" stop-color="#f0efec"/><stop offset="1" stop-color="#9a9994"/>
    </linearGradient>
    <pattern id="lmBrush" width="400" height="3" patternUnits="userSpaceOnUse">
      <rect width="400" height="1" fill="#fff" opacity=".07"/>
    </pattern>
    <filter id="lmSoft" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="lmSoft2" x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation="1.4"/></filter>
    <radialGradient id="lmGlow" cx=".5" cy="0" r=".5"><stop offset="0" stop-color="#fff2dc"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>
  </defs>
  <g class="lm-shadow">
    <ellipse cx="200" cy="30" rx="26" ry="5" fill="#000" opacity=".16" filter="url(#lmSoft)"/>
    <rect x="30" y="78" width="340" height="7" rx="3.5" fill="#000" opacity=".16" filter="url(#lmSoft)"/>
  </g>
  <rect x="178" y="4" width="44" height="23" rx="2.5" fill="url(#lmPlate)"/>
  <rect x="178" y="4" width="44" height="23" rx="2.5" fill="url(#lmPlateSide)"/>
  <rect x="178.6" y="4.6" width="42.8" height="1.2" rx=".6" fill="#fff" opacity=".8"/>
  <rect x="178" y="25.6" width="44" height="1.4" rx=".7" fill="#000" opacity=".12"/>
  <rect x="184" y="17" width="32" height="8" rx="4" fill="url(#lmCyl)"/>
  <rect x="190.5" y="17" width="1.2" height="8" fill="#000" opacity=".18"/>
  <rect x="208.3" y="17" width="1.2" height="8" fill="#000" opacity=".18"/>
  <path d="M191 21 C 187 36, 189 50, 194 62" fill="none" stroke="#6e6d69" stroke-width="4.6" stroke-linecap="round" opacity=".5"/>
  <path d="M209 21 C 213 36, 211 50, 206 62" fill="none" stroke="#6e6d69" stroke-width="4.6" stroke-linecap="round" opacity=".5"/>
  <path d="M191 21 C 187 36, 189 50, 194 62" fill="none" stroke="url(#lmArm)" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M209 21 C 213 36, 211 50, 206 62" fill="none" stroke="url(#lmArm)" stroke-width="3.4" stroke-linecap="round"/>
  <rect x="187" y="58" width="26" height="9" rx="4.5" fill="url(#lmCyl)"/>
  <rect x="194" y="58" width="1" height="9" fill="#000" opacity=".2"/>
  <rect x="205" y="58" width="1" height="9" fill="#000" opacity=".2"/>
  <rect x="20" y="64" width="360" height="16" rx="8" fill="url(#lmBar)"/>
  <rect x="20" y="64" width="360" height="16" rx="8" fill="url(#lmBrush)"/>
  <rect x="30" y="67" width="340" height="1.4" rx=".7" fill="#fff" opacity=".85"/>
  <rect x="20" y="64" width="9" height="16" rx="4.5" fill="url(#lmCap)"/>
  <rect x="371" y="64" width="9" height="16" rx="4.5" fill="url(#lmCap)"/>
  <rect x="28.4" y="64.5" width=".9" height="15" fill="#000" opacity=".25"/>
  <rect x="370.7" y="64.5" width=".9" height="15" fill="#000" opacity=".25"/>
  <rect x="34" y="78.2" width="332" height="2.6" rx="1.3" fill="#d9d6cf"/>
  <g class="lm-dim" fill="#000"><rect x="178" y="4" width="44" height="23" rx="2.5"/><path d="M191 21 C 187 36, 189 50, 194 62" fill="none" stroke="#000" stroke-width="4.6" stroke-linecap="round"/><path d="M209 21 C 213 36, 211 50, 206 62" fill="none" stroke="#000" stroke-width="4.6" stroke-linecap="round"/><rect x="187" y="58" width="26" height="9" rx="4.5"/><rect x="20" y="64" width="360" height="16" rx="8"/></g>
  <g class="lm-glow">
    <rect x="34" y="78.2" width="332" height="2.6" rx="1.3" fill="#fff4e0"/>
    <rect x="30" y="78" width="340" height="5" rx="2.5" fill="#ffe2b5" opacity=".9" filter="url(#lmSoft2)"/>
  </g>
</svg>`;
// Selezione flottante
const floating = $("#floating");
floating.innerHTML = SELEZIONE.map(byN).filter(i => i > -1).map((i, k) => {
  const o = OPERE[i];
  return `<figure class="float reveal" data-work="${i}">
    <div class="hang" data-depth="${[14, 8, 20, 10, 16, 6][k % 6]}">
      <button type="button" class="lamp" aria-label="Accendi la luce su ${esc(o.titolo)}" aria-pressed="false">${LAMP_SVG}</button>
      <div class="frame"><img src="${thumb(o)}" alt="${esc(o.titolo)}, ${esc(o.tecnica)}" width="${o.w}" height="${o.h}" loading="lazy" decoding="async"></div>
      <span class="beam" aria-hidden="true"></span>
    </div>
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
    const onLamp = !!(t.closest && t.closest(".lamp"));
    cur.classList.toggle("is-work", !inStage && !onLamp && !!(t.closest && t.closest("[data-work]")));
    cur.classList.toggle("is-link", onLamp || (!!(t.closest && t.closest("a, button, select, input, textarea, label")) && !t.closest("[data-work]")));
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
   6b. FARETTI (solo nella sezione Opere)
   Si accendono solo sostando sul faretto (o toccandolo sul telefono):
   luce calda sul quadro e sala che si fa buia, come in galleria.
------------------------------------------------------------------ */
const night = $("#night");
let litFig = null, onTimer = null, offTimer = null;
function lightOn(fig) {
  clearTimeout(offTimer);
  if (litFig === fig) return;
  if (litFig) lightOff(true);
  const hang = $(".hang", fig), lamp = $(".lamp", fig), beam = $(".beam", fig);
  beam.style.top = (lamp.offsetTop + lamp.offsetHeight * 0.9) + "px";
  litFig = fig;
  fig.classList.add("lit");
  lamp.setAttribute("aria-pressed", "true");
  night.classList.add("on");
  // sul telefono porta il quadro illuminato al centro dello schermo
  if (!finePointer) {
    const r = fig.getBoundingClientRect(), target = r.top + scrollY - Math.max(70, (innerHeight - r.height) / 2);
    if (Math.abs(target - scrollY) > 40) window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });
  }
}
function lightOff(now) {
  clearTimeout(onTimer);
  if (!litFig) return;
  const fig = litFig; litFig = null;
  fig.classList.remove("lit");
  $(".lamp", fig).setAttribute("aria-pressed", "false");
  if (!now || !document.querySelector(".float.lit")) night.classList.remove("on");
}
floating.addEventListener("click", e => {
  const lamp = e.target.closest(".lamp");
  if (!lamp) return;
  e.stopPropagation();                       // il faretto non apre il quadro
  const fig = lamp.closest(".float");
  litFig === fig ? lightOff() : lightOn(fig);
}, true);
if (finePointer) {
  // sosta di un attimo sul faretto: chi ci passa sopra per caso non accende niente
  floating.addEventListener("mouseover", e => {
    const lamp = e.target.closest(".lamp"), fig = e.target.closest(".float");
    if (lamp) { clearTimeout(offTimer); clearTimeout(onTimer); onTimer = setTimeout(() => lightOn(lamp.closest(".float")), 380); }
    else if (fig && fig === litFig) clearTimeout(offTimer);
  });
  floating.addEventListener("mouseout", e => {
    const to = e.relatedTarget;
    if (e.target.closest(".lamp") && !(to && to.closest && to.closest(".lamp"))) clearTimeout(onTimer);
    if (litFig && !(to && to.closest && to.closest(".float") === litFig)) { clearTimeout(offTimer); offTimer = setTimeout(() => lightOff(), 260); }
  });
}
// sul telefono: si spegne toccando altrove o scorrendo via
document.addEventListener("click", e => { if (litFig && !e.target.closest(".float.lit")) lightOff(); });
let litY = 0;
addEventListener("scroll", () => {
  if (!litFig) return;
  const r = litFig.getBoundingClientRect();
  if (r.bottom < 60 || r.top > innerHeight - 60) lightOff();
}, { passive: true });
document.addEventListener("keydown", e => { if (e.key === "Escape" && litFig) lightOff(); });

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
  if (w) { lightOff(true); night.classList.remove("on"); openViewer(+w.dataset.work); }
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
  if (!ask.hidden) { if (e.key === "Escape") closeAsk(); return; }
  if (e.key === "Escape") closeViewer();
  if (e.key === "ArrowRight") fillViewer(cur_i + 1);
  if (e.key === "ArrowLeft") fillViewer(cur_i - 1);
});
// Invio di un messaggio al gestionale / email dello studio (senza aprire il programma di posta)
async function sendContact(data) {
  let r;
  try {
    r = await fetch("/api/contatti", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  } catch (e) { throw new Error("Connessione assente: controlla internet e riprova."); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error && !/Scrivi direttamente/.test(j.error) ? j.error : "Invio non riuscito, riprova tra qualche istante.");
}
// "Chiedi informazioni" su un'opera: modulo rapido sopra il quadro
const ask = $("#ask"), askForm = $("#askForm");
let askOpera = null;
function openAsk() {
  askOpera = OPERE[cur_i];
  $("#askTitle").textContent = askOpera.titolo;
  $("#askImg").src = askOpera.anteprima || askOpera.foto;
  askForm.hidden = false; $("#askDone").hidden = true; $("#askMsg").textContent = "";
  askForm.messaggio.value = `Buongiorno, vorrei ricevere informazioni sull'opera ${askOpera.titolo} (n. ${askOpera.n}).`;
  ask.hidden = false;
  setTimeout(() => (askForm.nome.value ? askForm.email : askForm.nome).focus({ preventScroll: true }), 50);
}
function closeAsk() { ask.hidden = true; }
$("#vAsk").addEventListener("click", e => { e.preventDefault(); openAsk(); });
$("#askClose").onclick = closeAsk; $("#askOk").onclick = closeAsk;
ask.addEventListener("click", e => { if (e.target === ask) closeAsk(); });
askForm.addEventListener("submit", async e => {
  e.preventDefault();
  const f = askForm, msg = $("#askMsg"), btn = f.querySelector(".ask-send");
  if (!f.nome.value.trim()) return msg.textContent = "Scrivi il tuo nome.", f.nome.focus();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) return msg.textContent = "Controlla l'indirizzo email.", f.email.focus();
  if (!f.messaggio.value.trim()) return msg.textContent = "Scrivi un messaggio.", f.messaggio.focus();
  if (!f.consenso.checked) return msg.textContent = "Serve il consenso per poterti rispondere.";
  btn.disabled = true; msg.textContent = "Invio in corso…";
  try {
    await sendContact({ opera: `${askOpera.titolo} (n. ${askOpera.n})`, nome: f.nome.value, email: f.email.value, motivo: "Informazioni su un'opera", messaggio: f.messaggio.value, consenso: true, sito_web: f.sito_web.value });
    // ricorda nome ed email per la prossima richiesta (solo su questo dispositivo)
    try { localStorage.setItem("sc-contatto", JSON.stringify({ nome: f.nome.value, email: f.email.value })); } catch (err) {}
    askForm.hidden = true; $("#askDone").hidden = false;
  } catch (err) { msg.textContent = err.message; }
  finally { btn.disabled = false; }
});
try { const c = JSON.parse(localStorage.getItem("sc-contatto") || "null"); if (c) { askForm.nome.value = c.nome || ""; askForm.email.value = c.email || ""; } } catch (err) {}
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
  // non ingrandito: il dito in verticale fa scorrere la pagina verso descrizione e misure
  stage.classList.toggle("zoomed", zs > 1.02);
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
    if (e.target.closest("button")) return;
    if (zs > 1.02 || pts.size) { try { stage.setPointerCapture(e.pointerId); } catch (err) {} }
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
      else if (Math.abs(dx) > Math.abs(dy)) { swipeDx = dx; zx = dx * 0.5; zy = 0; applyZoom(false); }
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
  // il browser ha preso il gesto (scorrimento verticale): azzera senza fare altro
  stage.addEventListener("pointercancel", () => { pts.clear(); start = null; swipeDx = 0; if (zs <= 1.02) resetZoom(true); });
  $("#vMore").addEventListener("click", () => $(".viewer-info").scrollIntoView({ behavior: "smooth", block: "start" }));
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
// Taglierino "torna su": compare quando scendi; toccandolo fa un breve taglio laterale e ti riporta in cima.
let cutting = false;
const onScroll = () => {
  nav.classList.toggle("solid", scrollY > 40);
  if (!cutting) toTop.classList.toggle("show", scrollY > innerHeight * 1.2);
};
toTop.addEventListener("click", () => {
  if (cutting) return;
  if (reduceMotion) { window.scrollTo(0, 0); return; }
  cutting = true;
  const slit = $("#slit"), tip = $(".k-tip", toTop).getBoundingClientRect();
  const x = tip.left, y0 = tip.top, len = Math.min(150, y0 - 24), dur = 520, ease = "cubic-bezier(.5,0,.2,1)";
  slit.style.left = (x - 3) + "px";
  slit.style.bottom = (innerHeight - y0) + "px";
  slit.style.height = len + "px";
  slit.style.transformOrigin = "50% 100%";
  toTop.classList.add("cutting");
  // breve incisione verso l'alto, poi tutto si dissolve mentre la pagina torna in cima
  slit.animate([{ opacity: 1, transform: "scaleY(0)" }, { opacity: 1, transform: "scaleY(1)", offset: .55 }, { opacity: 0, transform: "scaleY(1)" }],
    { duration: dur + 420, easing: "ease-out", fill: "forwards" });
  const k = toTop.animate([
    { transform: "translateY(0) rotate(24deg)", opacity: 1 },
    { transform: `translateY(${-len}px) rotate(24deg)`, opacity: 1, offset: .7 },
    { transform: `translateY(${-len - 10}px) rotate(24deg)`, opacity: 0 }
  ], { duration: dur + 160, easing: ease, fill: "forwards" });
  window.scrollTo({ top: 0, behavior: "smooth" });
  k.finished.then(() => {
    toTop.getAnimations().forEach(a => a.cancel());
    toTop.classList.remove("cutting", "show");
    setTimeout(() => { slit.getAnimations().forEach(a => a.cancel()); slit.style.height = "0"; }, 400);
    cutting = false; onScroll();
  });
});
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
   9. MODULO CONTATTI — invia il messaggio al gestionale e alla email dello studio
------------------------------------------------------------------ */
$("#form").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.currentTarget, msg = $("#formMsg"), btn = f.querySelector("button[type=submit]");
  const data = { opera: f.opera.value, nome: f.nome.value, email: f.email.value, motivo: f.motivo.value, messaggio: f.messaggio.value, consenso: f.consenso.checked, sito_web: f.sito_web.value };
  btn.disabled = true; msg.style.color = ""; msg.textContent = "Invio in corso…";
  try {
    await sendContact(data);
    f.reset();
    msg.style.color = "var(--ink)";
    msg.textContent = "Grazie, il messaggio è stato inviato. Ti risponderemo al più presto.";
  } catch (err) { msg.style.color = ""; msg.textContent = err.message; }
  finally { btn.disabled = false; }
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

/* ------------------------------------------------------------------
   12. CONDIVIDI (il sito o una singola opera)
------------------------------------------------------------------ */
const shareBox = $("#share");
async function shareLink(url, title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); return; } catch (e) { if (e && e.name === "AbortError") return; }
  }
  const enc = encodeURIComponent;
  $("#shareTitle").textContent = title;
  $("#shWa").href = `https://wa.me/?text=${enc(text + " " + url)}`;
  $("#shFb").href = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
  $("#shMail").href = `mailto:?subject=${enc(title)}&body=${enc(text + "\n" + url)}`;
  $("#shCopy").onclick = async () => {
    try { await navigator.clipboard.writeText(url); $("#shareMsg").textContent = "Link copiato."; }
    catch (e) { $("#shareMsg").textContent = url; }
  };
  $("#shareMsg").textContent = "";
  shareBox.hidden = false;
}
$("#shareClose").onclick = () => (shareBox.hidden = true);
shareBox.addEventListener("click", e => { if (e.target === shareBox) shareBox.hidden = true; });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !shareBox.hidden) shareBox.hidden = true; });
$("#shareSite").onclick = () => shareLink(location.origin + "/", "Studio Colarusso", "Guarda le opere di Giuseppe Colarusso:");
$("#shareWork").onclick = () => {
  const o = OPERE[cur_i];
  shareLink(`${location.origin}/#opera-${o.n}`, `${o.titolo} — Studio Colarusso`, `Guarda quest'opera di Giuseppe Colarusso: ${o.titolo}`);
};
// chi apre un link condiviso di un'opera la vede subito a schermo intero
const sharedN = (location.hash.match(/^#opera-(\d+)$/) || [])[1];
if (sharedN) {
  const idx = OPERE.findIndex(o => o.n === +sharedN);
  if (idx > -1) introReady.then(() => setTimeout(() => openViewer(idx), 1400));
}
})();
