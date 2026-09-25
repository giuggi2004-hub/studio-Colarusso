// Accesso al gestionale, in due passaggi:
// 1) password  2) codice di 6 cifre inviato alla email dello studio
// Protezioni: blocco dopo 5 tentativi sbagliati (15 min) e blocco generale dopo 20 in un'ora.
const crypto = require("crypto");
const A = require("../_lib/auth");
const store = require("../_lib/store");
const { mailReady, sendMail } = require("../_lib/mail");
const wait = ms => new Promise(r => setTimeout(r, ms));
const hash = s => crypto.createHash("sha256").update(String(s)).digest("hex");

async function locked(ip) {
  if (!store.conf()) return false;
  const [a, b] = await store.pipeline([["EXISTS", "sc:lock:ip:" + ip], ["EXISTS", "sc:lock:all"]]);
  return a === 1 || b === 1;
}
async function fail(ip) {
  if (!store.conf()) return;
  const [n1, , n2] = await store.pipeline([["INCR", "sc:fail:ip:" + ip], ["EXPIRE", "sc:fail:ip:" + ip, "900", "NX"], ["INCR", "sc:fail:all"], ["EXPIRE", "sc:fail:all", "3600", "NX"]]);
  if (n1 >= 5) await store.pipeline([["SET", "sc:lock:ip:" + ip, "1", "EX", "900"]]);
  if (n2 >= 20) {
    const [first] = await store.pipeline([["SET", "sc:lock:all", "1", "EX", "3600", "NX"]]);
    if (first === "OK" && mailReady()) sendMail({ subject: "⚠️ Gestionale bloccato per troppi tentativi", text: "Nell'ultima ora ci sono stati molti tentativi di accesso sbagliati al gestionale del sito. Per sicurezza l'accesso è bloccato per 1 ora.\n\nSe non eri tu, non devi fare nulla: il blocco si toglie da solo. Se succede spesso, cambia la password (ADMIN_PASSWORD su Vercel)." }).catch(() => {});
  }
}
async function clearFails(ip) { if (store.conf()) await store.pipeline([["DEL", "sc:fail:ip:" + ip]]); }

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Metodo non consentito" });
  if (!A.sameOrigin(req)) return res.status(403).json({ error: "Richiesta non consentita" });
  const ip = A.clientIp(req);
  const { password, code, remember } = req.body || {};
  try {
    if (await locked(ip)) return res.status(429).json({ error: "Troppi tentativi sbagliati. Per sicurezza l'accesso è bloccato: riprova più tardi." });

    // PASSO 2: codice ricevuto via email
    if (code !== undefined) {
      if (!A.hasCookie(req, "pre") || !store.conf()) return res.status(401).json({ error: "Il codice è scaduto: inserisci di nuovo la password." });
      const [saved, tries] = await store.pipeline([["GET", "sc:code"], ["INCR", "sc:code:tries"]]);
      if (!saved || tries > 5) { await store.pipeline([["DEL", "sc:code"]]); return res.status(401).json({ error: "Il codice è scaduto: inserisci di nuovo la password." }); }
      if (!A.safeEqual(hash(String(code).replace(/\D/g, "")), saved)) { await fail(ip); await wait(800); return res.status(401).json({ error: "Codice non corretto." }); }
      await store.pipeline([["DEL", "sc:code"], ["DEL", "sc:code:tries"]]);
      await clearFails(ip);
      A.createSession(res, remember ? [A.makeCookie("trust")] : []);
      return res.status(200).json({ ok: true });
    }

    // PASSO 1: password
    if (!A.checkPassword(password || "")) { await fail(ip); await wait(1200); return res.status(401).json({ error: "Password non corretta" }); }

    // dispositivo fidato, oppure verifica via email non disponibile → accesso diretto
    const twoStep = store.conf() && mailReady();
    if (!twoStep || A.hasCookie(req, "trust")) { await clearFails(ip); A.createSession(res); return res.status(200).json({ ok: true }); }

    const c = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
    await store.pipeline([["SET", "sc:code", hash(c), "EX", "600"], ["SET", "sc:code:tries", "0", "EX", "600"]]);
    await sendMail({
      subject: `Codice di accesso al gestionale: ${c}`,
      text: `Il tuo codice per entrare nel gestionale di Studio Colarusso è:\n\n${c}\n\nVale 10 minuti. Se non hai provato tu ad accedere, qualcuno conosce la tua password: cambiala subito (ADMIN_PASSWORD su Vercel).`,
      html: `<p>Il tuo codice per entrare nel gestionale di Studio Colarusso è:</p><p style="font-size:32px;letter-spacing:8px;font-family:Georgia,serif"><b>${c}</b></p><p style="color:#777">Vale 10 minuti. Se non hai provato tu ad accedere, qualcuno conosce la tua password: cambiala subito (ADMIN_PASSWORD su Vercel).</p>`
    });
    res.setHeader("Set-Cookie", A.makeCookie("pre"));
    res.status(200).json({ step: "code" });
  } catch (e) { console.error(e); res.status(500).json({ error: "Accesso non riuscito: " + e.message }); }
};
