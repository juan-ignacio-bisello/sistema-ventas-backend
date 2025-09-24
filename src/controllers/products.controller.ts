import type { Request, Response } from 'express';

export const createProducto = (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'crearProducto'
    })
}

export const updateProducto = (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'actualizarProducto'
    })
}

export const getProductos = (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'getProductos'
    })
}

export const deleteProducto = (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'deleteProducto'
    })
}