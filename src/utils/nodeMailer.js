// const nodemailer = require('nodemailer');

// module.exports = async (emailTarget, token) => {
  // transporter (gunakan gmail atau smtp lain)
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: process.env.EMAIL_USER,      // email pengirim
  //     pass: process.env.EMAIL_PASS       // password / app password
  //   }
  // });

  // const verificationUrl = `http://localhost:3001/verifikasi-email?token=${token}`;

  // const mailOptions = {
  //   from: process.env.EMAIL_USER,
  //   to: emailTarget,
  //   subject: 'Verification Email',
  //   html: `
  //     <h3>Verify Your Email</h3>
  //     <p>Click the link below to verify your email:</p>
  //     <a href="${verificationUrl}">${verificationUrl}</a>
  //   `
  // };

//   await transporter.sendMail(mailOptions);
// };
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true, // wajib true untuk port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

module.exports = transporter;
