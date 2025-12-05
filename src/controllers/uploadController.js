// src/controllers/uploadController.js

// Terima file yang sudah diproses multer
async function uploadImage(req, res) {
  try {
    // Kalau tidak ada file
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded. Please upload an image with field name "image".',
      });
    }

    // Informasi file tersimpan di req.file
    const fileInfo = {
      filename: req.file.filename,
      path: req.file.path,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    };

    return res.status(200).json({
      message: 'Image uploaded successfully',
      file: fileInfo,
    });
  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

module.exports = {
  uploadImage,
};
