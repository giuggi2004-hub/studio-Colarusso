// Sessione del gestionale: cookie firmato, valido 12 ore.
const crypto = require("crypto");

const COOKIE = "sc_admin";
const MAX_AGE = 12 * 60 * 60; // secondi

function secret() {
  const s = process.env.SESSION_SECRET || "";
  if (s.length < 16) throw new Error("SESSION_SECRET mancante o troppo corta (almeno 16 caratteri)");
  return s;
}
function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}
function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function readCookie(req, name) {
  const raw = req.headers.cookie || "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}
// Cookie firmati: "admin" = sessione, "pre" = password giusta in attesa del codice, "trust" = dispositivo fidato
const COOKIES = { admin: [COOKIE, MAX_AGE], pre: ["sc_pre", 10 * 60], trust: ["sc_trust", 30 * 24 * 60 * 60] };
function makeCookie(kind) {
  const [name, age] = COOKIES[kind];
  const exp = Math.floor(Date.now() / 1000) + age;
  const value = `${exp}.${sign(kind + "." + exp)}`;
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
}
function killCookie(kind) { return `${COOKIES[kind][0]}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`; }
function hasCookie(req, kind) {
  try {
    const v = readCookie(req, COOKIES[kind][0]);
    if (!v) return false;
    const [exp, sig] = v.split(".");
    if (!exp || !sig || +exp < Date.now() / 1000) return false;
    return safeEqual(sig, sign(kind + "." + exp));
  } catch (e) { return false; }
}
function createSession(res, extra = []) { res.setHeader("Set-Cookie", [makeCookie("admin"), killCookie("pre"), ...extra]); }
function clearSession(res) { res.setHeader("Set-Cookie", [killCookie("admin"), killCookie("pre")]); }
function isLogged(req) { return hasCookie(req, "admin"); }
function clientIp(req) {
  return String(req.headers["x-real-ip"] || String(req.headers["x-forwarded-for"] || "").split(",")[0] || "?").trim().slice(0, 64);
}
function checkPassword(pw) {
  const real = process.env.ADMIN_PASSWORD || "";
  if (real.length < 8) return false;
  // confronto su hash per evitare differenze di tempo
  const h = s => crypto.createHash("sha256").update(String(s)).digest();
  return crypto.timingSafeEqual(h(pw), h(real));
}
// Blocca le richieste che non arrivano dal sito stesso
function sameOrigin(req) {
  const o = req.headers.origin;
  if (!o) return true;
  try { return new URL(o).host === req.headers.host; } catch (e) { return false; }
}
function requireAdmin(req, res) {
  if (!sameOrigin(req)) { res.status(403).json({ error: "Richiesta non consentita" }); return false; }
  if (!isLogged(req)) { res.status(401).json({ error: "Sessione scaduta: accedi di nuovo" }); return false; }
  return true;
}
module.exports = { createSession, clearSession, isLogged, checkPassword, requireAdmin, sameOrigin, makeCookie, killCookie, hasCookie, clientIp, safeEqual };
