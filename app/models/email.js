const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text, html) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"LTWeb2 👻" <${process.env.EMAIL_USER}>`, 
    to, 
    subject,
    text, 
    html,
  });

  return info;
}

module.exports = sendEmail;
