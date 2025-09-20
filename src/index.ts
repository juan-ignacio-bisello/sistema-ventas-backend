import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import vision from '@google-cloud/vision';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

import productsRoutes from "./routes/products.routes";
import prescriptionRoutes from "./routes/prescription.routes";

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

// Configurar Google Vision Client
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "",
});

// Configurar Firebase Storage (opcional)
const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "" });
const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET ?? "" );

// Configurar multer para subir imágenes
const upload = multer({ dest: "uploads/" });

// Directorio público
app.use(express.static("public"));

// Rutas
app.use("/api/products", productsRoutes);
app.use("/api/recetas", prescriptionRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server running on port:", port);
});
