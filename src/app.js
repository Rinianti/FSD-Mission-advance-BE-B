// require('dotenv').config({ path: './.env' });
// const express = require('express');
// require('dotenv').config();
// const userRoutes = require('./routes/userRoutes');
// const authRoutes = require('./routes/authRoutes');
// const movieRoutes = require('./routes/movieRoutes');
// const verifyRoutes = require('./routes/verifyRoutes');



// const app = express();
// app.use(express.json());
// app.use(userRoutes);
// app.use(authRoutes);
// app.use(movieRoutes);
// app.use(verifyRoutes);

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => console.log('Server running on port', PORT));
require('dotenv').config({ path: './.env' });
const express = require('express');

const app = express();
app.use(express.json());

// OPTIONAL: supaya file di folder /uploads bisa diakses via URL
app.use('/uploads', express.static('uploads'));

const transporter = require("./config/nodemailer");

// 👉 ROUTE TEST EMAIL
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // kirim ke email kamu sendiri
      subject: "Test Email Gmail SMTP",
      text: "Jika kamu menerima email ini, berarti konfigurasi Gmail berhasil!"
    });

    res.send("Email terkirim!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal mengirim email");
  }
});

// ROUTE LAIN
app.use(require('./routes/userRoutes'));
app.use(require('./routes/authRoutes'));
app.use(require('./routes/movieRoutes'));
app.use(require('./routes/verifyRoutes'));

// ✅ TAMBAHKAN INI UNTUK /upload
app.use(require('./routes/uploadRoutes'));

// START SERVER
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on port", PORT));

