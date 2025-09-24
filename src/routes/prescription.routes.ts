import { Router } from 'express';
import { uploadPrescription } from '../controllers/prescription.controller';
import multer from 'multer';

const router = Router();

router.post('/upload', (req, res, next) => {
  // Middleware de Multer para manejar la subida
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos de imagen'));
      }
    },
  }).single('file');

  upload(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next(); // Pasa al controller si no hay errores
  });
}, uploadPrescription);

export default router;