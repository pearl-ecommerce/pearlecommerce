import multer from 'multer';
import { Request } from 'express';

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb) {
    cb(null, 'uploads/');  // Save the images to the 'uploads/' folder
  },
  filename: function (_req: Request, file: Express.Multer.File, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // Add timestamp to avoid filename collisions
  }
});

// Initialize multer with the storage settings and limit to multiple files (e.g., max 5 files)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }  // Optional: Set file size limit to 5MB
})  // 'images' is the field name and we allow up to 5 files

export default upload;  // Export the upload instance
