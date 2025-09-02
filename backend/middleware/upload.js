// backend/middleware/upload.js
const multer = require('multer');
const path   = require('path');

/* Local disk storage */
const storage = multer.diskStorage({
  destination: (req, _file, cb) => cb(null, 'uploads/avatars'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (/^image\/(jpeg|png)$/.test(file.mimetype) && file.size <= 2 * 1024 * 1024) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg/.png ≤ 2 MB allowed'));
  }
};

module.exports = multer({ storage, fileFilter });