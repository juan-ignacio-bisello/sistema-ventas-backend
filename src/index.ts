const express = require('express');
require('dotenv').config({ path: './.env'});
const cors = require('cors');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Configurar Google Vision Client
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

// Configurar Firebase Storage (opcional)
const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);

// Configurar multer para subir imágenes
const upload = multer({ dest: 'uploads/' });

// Directorio publico
app.use( express.static('public') );

//Rutas
app.use('/api/products', require('./routes/products.routes') );
app.use('/api/recetas', require( './routes/prescription.routes' ))

const port = process.env.PORT;

app.listen( port, () => {
    console.log('Server running on port: ', port);
})