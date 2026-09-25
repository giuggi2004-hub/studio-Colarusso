// Messaggi ricevuti dal modulo contatti: elenco, stato, note, eliminazione
const { requireAdmin } = require("../_lib/auth");
const store = require("../_lib/store");
const STATI = ["nuovo", "in-corso", "risolto"];

module.exports = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  res.setHeader("Cache-Control", "no-store");
  if (!store.conf()) return res.status(200).json({ configured: false, messages: [] });
  try {
    if (req.method === "GET") return res.status(200).json({ configured: true, messages: await store.listMessages() });
    if (req.method !== "POST") return res.status(405).json({ error: "Metodo non consentito" });
    const { id, action, stato, nota } = req.body || {};
    if (!/^[a-z0-9]{6,40}$/.test(id || "")) return res.status(400).json({ error: "Messaggio non valido" });
    if (action === "delete") { await store.deleteMessage(id); return res.status(200).json({ ok: true }); }
    const m = await store.getMessage(id);
    if (!m) return res.status(404).json({ error: "Messaggio non trovato" });
    if (action === "stato" && STATI.includes(stato)) { m.stato = stato; m.aggiornato = Date.now(); }
    if (action === "nota") { m.nota = String(nota || "").slice(0, 3000); m.aggiornato = Date.now(); }
    await store.saveMessage(m);
    res.status(200).json({ ok: true, message: m });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
