// Il gestionale non ha un indirizzo da digitare: si apre dal gesto segreto sul logo.
// /pannello mostra il gestionale SOLO a chi ha già fatto l'accesso (password + codice).
// A tutti gli altri, come per /admin o qualsiasi indirizzo inesistente, risponde "Pagina non trovata".
const ADMIN_HTML = require("./_lib/admin-page");
const { isLogged } = require("./_lib/auth");

const NOT_FOUND = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Pagina non trovata — Studio Colarusso</title><link rel="icon" href="/favicon.png">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display&family=Jost:wght@300&display=swap" rel="stylesheet">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F9F8F6;color:#111;font-family:Jost,Arial,sans-serif;font-weight:300;text-align:center;padding:24px}
img{width:200px;margin-bottom:40px}h1{font-family:'Playfair Display',Georgia,serif;font-weight:400;font-size:clamp(2rem,6vw,3.4rem);margin:0 0 12px}
p{color:#77746F;margin:0 0 34px}a{display:inline-block;padding:14px 30px;background:#111;color:#F9F8F6;text-decoration:none;font-size:11px;letter-spacing:.3em;text-transform:uppercase}
a:hover{background:#D32F2F}span{color:#D32F2F}</style></head>
<body><main><img src="/logo.png" alt="Studio Colarusso"><h1>Pagina non trovata<span>.</span></h1><p>Questo strato non esiste più: forse è stato strappato.</p><a href="/">Torna al sito</a></main></body></html>`;

module.exports = (req, res) => {
  const asked = String((req.query && req.query.p) || "").replace(/^\/+|\/+$/g, "");

  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", "no-store");
  if (asked === "pannello" && isLogged(req)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
    res.setHeader("Referrer-Policy", "no-referrer");
    return res.status(200).send(ADMIN_HTML);
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(404).send(NOT_FOUND);
};
