// Archivio messaggi (Upstash Redis collegato da Vercel → Storage)
function conf() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}
async function pipeline(cmds) {
  const c = conf(); if (!c) throw new Error("Archivio messaggi non collegato (Vercel → Storage)");
  const r = await fetch(c.url + "/pipeline", { method: "POST", headers: { Authorization: `Bearer ${c.token}`, "Content-Type": "application/json" }, body: JSON.stringify(cmds) });
  if (!r.ok) throw new Error("Archivio messaggi: errore " + r.status);
  const out = await r.json();
  for (const x of out) if (x.error) throw new Error("Archivio messaggi: " + x.error);
  return out.map(x => x.result);
}
const KEY = "sc:msgs";
async function saveMessage(m) {
  await pipeline([["SET", "sc:msg:" + m.id, JSON.stringify(m)], ["ZADD", KEY, String(m.ts), m.id]]);
}
async function listMessages(limit = 500) {
  const [ids] = await pipeline([["ZREVRANGE", KEY, "0", String(limit - 1)]]);
  if (!ids || !ids.length) return [];
  const [vals] = await pipeline([["MGET", ...ids.map(i => "sc:msg:" + i)]]);
  return vals.map(v => { try { return JSON.parse(v); } catch (e) { return null; } }).filter(Boolean);
}
async function getMessage(id) { const [v] = await pipeline([["GET", "sc:msg:" + id]]); return v ? JSON.parse(v) : null; }
async function deleteMessage(id) { await pipeline([["DEL", "sc:msg:" + id], ["ZREM", KEY, id]]); }
module.exports = { pipeline, conf, saveMessage, listMessages, getMessage, deleteMessage };
