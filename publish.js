// Pubblica tutte le modifiche in un'unica volta (un solo aggiornamento del sito)
const { requireAdmin } = require("../_lib/auth");
const { gh, cfg } = require("../_lib/github");

const HEADER = `/* =====================================================================
   STUDIO COLARUSSO — DATI DEL SITO
   Contenuti del sito.
   ===================================================================== */
window.SITO = `;
const SAFE_PATH = /^img\/opere\/[a-z0-9-]+\.(webp|jpg|png)$|^opera-[0-9]+(-m)?\.webp$/;

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Metodo non consentito" });
  if (!requireAdmin(req, res)) return;
  const { sito, files = [], removed = [] } = req.body || {};
  if (!sito || !Array.isArray(sito.opere) || typeof sito.contatti !== "object") return res.status(400).json({ error: "Dati non validi" });
  for (const f of files) if (!SAFE_PATH.test(f.path || "") || !/^[0-9a-f]{40}$/.test(f.sha || "")) return res.status(400).json({ error: "Percorso foto non valido" });
  for (const p of removed) if (!SAFE_PATH.test(p || "")) return res.status(400).json({ error: "Percorso da eliminare non valido" });
  try {
    const { branch } = cfg();
    const ref = await gh(`/git/ref/heads/${encodeURIComponent(branch)}`);
    const base = await gh(`/git/commits/${ref.object.sha}`);
    const content = HEADER + JSON.stringify(sito, null, 2) + ";\n";
    const d = await gh(`/git/blobs`, { method: "POST", body: JSON.stringify({ content: Buffer.from(content, "utf8").toString("base64"), encoding: "base64" }) });
    const tree = [
      ...files.map(f => ({ path: f.path, mode: "100644", type: "blob", sha: f.sha })),
      { path: "data/sito.js", mode: "100644", type: "blob", sha: d.sha }
    ];
    // elimina solo le foto che esistono davvero
    if (removed.length) {
      const full = await gh(`/git/trees/${base.tree.sha}?recursive=1`);
      const exists = new Set(full.tree.map(t => t.path));
      for (const p of removed) if (exists.has(p)) tree.push({ path: p, mode: "100644", type: "blob", sha: null });
    }
    const t = await gh(`/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: base.tree.sha, tree }) });
    const c = await gh(`/git/commits`, { method: "POST", body: JSON.stringify({ message: "Aggiornamento dal gestionale", tree: t.sha, parents: [ref.object.sha] }) });
    await gh(`/git/refs/heads/${encodeURIComponent(branch)}`, { method: "PATCH", body: JSON.stringify({ sha: c.sha }) });
    res.status(200).json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
