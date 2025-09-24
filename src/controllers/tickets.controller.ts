import type { Request, Response } from 'express';

export const createTicket = (req: Request, res: Response) => {
    res.status(200).json({
        ok: true,
        message: 'ticketCreate'
    })
}

export const getTickets = (req: Request, res: Response) => {
    res.status(200).json({
        ok: true,
        message: 'getTickets'
    })
}

export const updateTicket = (req: Request, res: Response) => {
    
    const { id } = req.params;
    console.log(id);

    if (!id) {
        return res.status(404).json({
            ok: false,
            message: 'ID is required'
        });
    }

    res.status(200).json({
        ok: true,
        message: 'updateTicket',
        id: id
    })
}