

const createProducto = (req: any, res: any) => {
    res.json({
        ok: true,
        message: 'crearProducto'
    })
}

const updateProducto = (req: any, res: any) => {
    res.json({
        ok: true,
        message: 'actualizarProducto'
    })
}

const getProductos = (req: any, res: any) => {
    res.json({
        ok: true,
        message: 'getProductos'
    })
}

const deleteProducto = (req: any, res: any) => {
    res.json({
        ok: true,
        message: 'deleteProducto'
    })
}


module.exports = {
    createProducto,
    updateProducto,
    getProductos,
    deleteProducto
}