import type { Request, Response } from 'express';

const createProducto = (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'crearProducto'
    })
}

const updateProducto = (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'actualizarProducto'
    })
}

const getProductos = (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'getProductos'
    })
}

const deleteProducto = (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'deleteProducto'
    })
}


