const express = require('express');
require('dotenv').config({ path: './.env'});

const app = express();

// Directorio publico
app.use( express.static('public') );

//Rutas
app.use('/api/products', require('./routes/products.routes') );

const port = process.env.PORT;

app.listen( port, () => {
    console.log('Server running on port: ', port);
})