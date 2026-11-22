import multer from 'multer';
import { MAX_UPLOAD_SIZE_BYTES } from '../config/constants.js';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_UPLOAD_SIZE_BYTES,
  },
  fileFilter: (_req, file, cb) => {
    // Accept text, csv, or generic mime-types for csv files
    const validMimes = [
      'text/csv',
      'text/plain',
      'application/vnd.ms-excel',
      'application/csv',
      'text/x-csv',
    ];
    const isCsvExt = file.originalname.toLowerCase().endsWith('.csv') || file.originalname.toLowerCase().endsWith('.txt');

    if (validMimes.includes(file.mimetype) || isCsvExt) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV or plain text files are allowed'));
    }
  },
});
