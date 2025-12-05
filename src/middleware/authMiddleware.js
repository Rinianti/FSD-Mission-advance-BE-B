const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Format Authorization salah. Gunakan: Bearer <token>"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Token invalid atau expired",
      error: error.message
    });
  }
};
