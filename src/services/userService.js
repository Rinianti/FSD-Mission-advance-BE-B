const db = require('../db');

// Cari user berdasarkan username ATAU email
exports.findByUsernameOrEmail = async (username, email) => {
  const [rows] = await db.query(
    `SELECT * FROM user WHERE username = ? OR email = ? LIMIT 1`,
    [username, email]
  );
  return rows[0] || null;
};
exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    `SELECT * FROM user WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0] || null;
};
// Simpan user baru
exports.createUser = async (data) => {
  const { fullname, username, email, passwordHash, status_akun } = data;

  const [result] = await db.query(
    `INSERT INTO user (fullname, username, email, password, status_akun)
     VALUES (?, ?, ?, ?, ?)`,
    [fullname, username, email, passwordHash, status_akun]
  );

  return { user_id: result.insertId };
};

// GET semua user
exports.getAllUsers = async () => {
  const [rows] = await db.query("SELECT * FROM user");
  return rows;
};

// GET user by ID
exports.getUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM user WHERE user_id = ?", [id]);
  return rows[0] || null;
};
