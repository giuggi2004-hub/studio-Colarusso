const { isLogged } = require("../_lib/auth");
module.exports = (req, res) => { res.setHeader("Cache-Control", "no-store"); res.status(200).json({ logged: isLogged(req) }); };
