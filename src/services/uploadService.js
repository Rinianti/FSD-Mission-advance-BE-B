// src/services/uploadService.js
const multer = require('multer');
const path = require('path');

// Tentukan tempat penyimpanan & nama file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // folder /uploads di root project
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    // contoh nama file: 1689345678-rania123.jpg
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}-${originalName}`);
  },
});

// Filter tipe file (hanya gambar)
function fileFilter(req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (!allowedTypes.includes(file.mimetype)) {
    // tolak file
    return cb(new Error('Only JPG and PNG images are allowed'), false);
  }

  cb(null, true); // terima file
}

// Buat instance multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // max 2 MB
  },
});

// Middleware untuk single upload field name: "image"
const uploadSingleImage = upload.single('image');

module.exports = {
  uploadSingleImage,
};
