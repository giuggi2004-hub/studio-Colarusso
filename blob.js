// Carica una foto su GitHub (una alla volta, per restare sotto i limiti di Vercel)
const { requireAdmin } = require("../_lib/auth");
const { gh } = require("../_lib/github");
const OK_TYPES = /^image\/(webp|jpeg|png)$/;

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Metodo non consentito" });
  if (!requireAdmin(req, res)) return;
  const { content, type } = req.body || {};
  if (typeof content !== "string" || !OK_TYPES.test(type || "")) return res.status(400).json({ error: "File non valido" });
  if (content.length > 4_000_000) return res.status(413).json({ error: "Foto troppo pesante" });
  try {
    const b = await gh(`/git/blobs`, { method: "POST", body: JSON.stringify({ content, encoding: "base64" }) });
    res.status(200).json({ sha: b.sha });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
