import { Router } from "express";
import { createTicket, getTickets, updateTicket } from "../controllers/tickets.controller";

const router = Router();

router.post("/", createTicket);

router.get('/', getTickets );

router.put('/:id', updateTicket );

export default router;