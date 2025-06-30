const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';
    const folder = isPDF ? 'pdfs' : 'images';    return {
      folder: `chat-app/${folder}`,
      resource_type: isPDF ? 'raw' : 'image',
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-').replace(/[^\w.-]/g, '')}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});

module.exports = upload;
