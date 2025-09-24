import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import vision from '@google-cloud/vision';
import dotenv from 'dotenv';

import productsRoutes from './routes/products.routes';
import prescriptionRoutes from './routes/prescription.routes';
import ticketRoutes from './routes/ticket.routes';

dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Configurar Google Vision Client
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set');
}
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS as string,
});

// Configurar Firebase Storage (opcional, solo si lo usás)
const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
if (!process.env.FIREBASE_STORAGE_BUCKET) {
  throw new Error('FIREBASE_STORAGE_BUCKET environment variable is not set');
}
const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET as string);

// Configurar multer para usar memoria (buffer)
const upload = multer({
  storage: multer.memoryStorage(), // Asegura que usa buffer en memoria
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Solo permite imágenes
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  },
});

// Directorio público
app.use(express.static('public'));

// Rutas
app.use('/api/products', productsRoutes);
app.use('/api/recetas', prescriptionRoutes);
app.use('/api/tickets', ticketRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Server running on port:', port);
});