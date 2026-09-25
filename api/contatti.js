// Modulo contatti: invia il messaggio all'email dello studio (tramite Gmail)
const nodemailer = require("nodemailer");
const { sameOrigin } = require("./_lib/auth");
const store = require("./_lib/store");
const crypto = require("crypto");

const hits = new Map(); // limite semplice: max 5 messaggi ogni 10 minuti per indirizzo
const clean = (s, max) => String(s || "").replace(/[\r\0]/g, "").trim().slice(0, max);
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Metodo non consentito" });
  if (!sameOrigin(req)) return res.status(403).json({ error: "Richiesta non consentita" });
  const b = req.body || {};
  if (b.sito_web) return res.status(200).json({ ok: true }); // campo trappola per i robot

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "?";
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < 600000);
  if (list.length >= 5) return res.status(429).json({ error: "Troppi messaggi in poco tempo. Riprova tra qualche minuto." });
  list.push(now); hits.set(ip, list);

  const nome = clean(b.nome, 120), email = clean(b.email, 200), motivo = clean(b.motivo, 80), messaggio = clean(b.messaggio, 5000);
  if (!nome || !messaggio || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return res.status(400).json({ error: "Controlla nome, email e messaggio." });
  if (!b.consenso) return res.status(400).json({ error: "Serve il consenso al trattamento dei dati." });

  const opera = clean(b.opera, 160);
  const m = { id: Date.now().toString(36) + crypto.randomBytes(4).toString("hex"), ts: Date.now(), nome, email, motivo, messaggio, opera, stato: "nuovo", nota: "" };

  // 1) salva nel gestionale
  let saved = false;
  if (store.conf()) { try { await store.saveMessage(m); saved = true; } catch (e) { console.error(e); } }

  // 2) avvisa via email (se configurata)
  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return saved ? res.status(200).json({ ok: true }) : res.status(500).json({ error: "Invio non ancora configurato." });
  try {
    const t = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass: pass.replace(/\s/g, "") } });
    await t.sendMail({
      from: `"Sito Studio Colarusso" <${user}>`,
      to: process.env.CONTACT_TO || user,
      replyTo: `"${nome.replace(/"/g, "")}" <${email}>`,
      subject: `[Sito] ${motivo || "Messaggio"} — ${nome}`,
      text: `${messaggio}\n\n— ${nome}\n${email}\nMotivo: ${motivo}${opera ? "\nOpera: " + opera : ""}`,
      html: `<p>${esc(messaggio).replace(/\n/g, "<br>")}</p><hr><p><b>${esc(nome)}</b><br>${esc(email)}<br>Motivo: ${esc(motivo)}${opera ? "<br>Opera: " + esc(opera) : ""}</p><p style="color:#888;font-size:12px">Per rispondere premi "Rispondi". Trovi il messaggio anche nel gestionale, sezione Messaggi.</p>`
    });
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    if (saved) return res.status(200).json({ ok: true });
    res.status(500).json({ error: "Invio non riuscito. Scrivi direttamente a " + (process.env.CONTACT_TO || user) });
  }
};
