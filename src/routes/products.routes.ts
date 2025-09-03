const express = require('express');
const router = express.Router();

const { createProducto, updateProducto, getProductos, deleteProducto } = require('../controllers/products');

router.get('/', getProductos );

router.post('/', createProducto )

router.delete('/', deleteProducto )

router.put('/', updateProducto )


module.exports = router;