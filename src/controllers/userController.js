// const bcrypt = require('bcrypt');
// const userService = require('../services/userService');

// exports.register = async (req, res) => {
//   try {
//     const { fullname, username, email, password, status_akun } = req.body;

//     // Validasi field
//     if (!fullname || !username || !email || !password) {
//       return res.status(400).json({
//         message: "Field wajib: fullname, username, email, password"
//       });
//     }

    // Cek username/email sudah ada
    // const existing = await userService.findByUsernameOrEmail(username, email);

    // if (existing) {
    //   if (existing.username === username) {
    //     return res.status(409).json({ message: "Username sudah digunakan" });
    //   }
    //   if (existing.email === email) {
    //     return res.status(409).json({ message: "Email sudah digunakan" });
    //   }
    // }

    // Hash password
    // const passwordHash = await bcrypt.hash(password, 10);

    // Simpan user
//     const result = await userService.createUser({
//       fullname,
//       username,
//       email,
//       passwordHash,
//       status_akun: status_akun || "aktif",
//     });

//     res.status(201).json({
//       message: "User berhasil didaftarkan",
//       user_id: result.user_id
//     });

//   } catch (err) {
//     console.error("Register Error:", err);
//     res.status(500).json({
//       message: "Gagal mendaftar",
//       error: err.message
//     });
//   }
// };


// GET semua user
// exports.getAllUsers = async (req, res) => {
//   const users = await userService.getAllUsers();
//   res.json(users);
// };

// GET user berdasarkan ID
// exports.getUserById = async (req, res) => {
//   const id = req.params.id;
//   const user = await userService.getUserById(id);

//   if (!user) {
//     return res.status(404).json({ message: "User tidak ditemukan" });
//   }

//   res.json(user);
// };
const userService = require('../services/userService');
const bcrypt = require('bcrypt');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const existingUser = await userService.findByUsernameOrEmail(username, email);
    if (existingUser) {
      return res.status(400).json({ message: 'Username atau email sudah terdaftar' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await userService.createUser({
      fullname,
      username,
      email,
      passwordHash,
      status_akun: 1
    });

    res.json({ message: 'Berhasil daftar', user_id: result.user_id });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mendaftar', error: err.message });
  }
};

// GET semua user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data user', error: err.message });
  }
};

// GET user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil user', error: err.message });
  }
};

