const db = require('../db');

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // cek token di database
    const [rows] = await db.query("SELECT * FROM user WHERE verify_token = ?", [token]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid Verification Token" });
    }

    // hapus token = verified
    await db.query("UPDATE user SET verify_token = NULL WHERE verify_token = ?", [token]);

    res.json({ message: "Email Verified Successfully" });

  } catch (err) {
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
};
