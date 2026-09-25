const nodemailer = require("nodemailer");
function mailReady() { return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD); }
async function sendMail(opts) {
  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD.replace(/\s/g, "");
  const t = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass } });
  return t.sendMail({ from: `"Studio Colarusso" <${user}>`, to: process.env.CONTACT_TO || user, ...opts });
}
module.exports = { mailReady, sendMail };
