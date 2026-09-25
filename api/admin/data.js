// Legge i contenuti del sito (data/sito.js) da GitHub
const { requireAdmin } = require("../_lib/auth");
const { gh, cfg } = require("../_lib/github");

module.exports = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const { branch } = cfg();
    const txt = await gh(`/contents/data/sito.js?ref=${encodeURIComponent(branch)}`, { raw: true, accept: "application/vnd.github.raw+json" });
    const i = txt.indexOf("window.SITO");
    const json = txt.slice(txt.indexOf("=", i) + 1).trim().replace(/;\s*$/, "");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(JSON.parse(json));
  } catch (e) { res.status(e.status === 404 ? 404 : 500).json({ error: e.message }); }
};
