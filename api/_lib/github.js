// Collegamento a GitHub con la chiave salvata nelle impostazioni di Vercel.
function cfg() {
  const token = process.env.GITHUB_TOKEN, repo = process.env.GITHUB_REPO, branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) throw new Error("GITHUB_TOKEN o GITHUB_REPO mancanti nelle impostazioni di Vercel");
  return { token, repo, branch };
}
async function gh(path, opts = {}) {
  const { token, repo } = cfg();
  const r = await fetch(`https://api.github.com/repos/${repo}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: opts.accept || "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "studio-colarusso-admin",
      ...(opts.body ? { "Content-Type": "application/json" } : {})
    }
  });
  if (!r.ok) {
    let msg = String(r.status);
    try { msg = (await r.json()).message || msg; } catch (e) {}
    const err = new Error("GitHub: " + msg); err.status = r.status; throw err;
  }
  return opts.raw ? r.text() : r.json();
}
module.exports = { gh, cfg };
