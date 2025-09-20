import { Request, Response } from "express";
import fs from "fs";
import { extractText } from '../service/vision.service';
import { parsePrescription } from '../service/parce.service';

export async function uploadPrescription(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const filePath = req.file.path;

  try {
    const fullText = await extractText(filePath);
    const parsed = parsePrescription(fullText);
    res.json({ parsed, rawText: fullText });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing prescription" });

  } finally {
    try { await fs.promises.unlink(filePath); } catch(e) { console.warn("No se pudo borrar tmp:", e); }
  }
}

const pruebaGet = (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'crearProducto'
    })
}