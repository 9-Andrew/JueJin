const multer = require('multer');
const path = require('path');

// 设置文件上传的配置
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (_req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname);
  },
});

const upload = multer({ storage });

module.exports = upload;
