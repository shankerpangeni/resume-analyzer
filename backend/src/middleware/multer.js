import multer from 'multer';

// Max file size 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

// Memory storage
const storage = multer.memoryStorage();

// Only PDFs allowed
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed!'), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});