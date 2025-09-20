import { Request, Response } from "express";
import fs from "fs";
import { extractText } from '../service/vision.service';
import { parsePrescription } from '../service/parce.service';

export async function uploadPrescription(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // 1. Extraer texto con Google Vision
    const fullText = await extractText(filePath);

    // 2. Parsear receta
    const parsed = parsePrescription(fullText);

    // 3. Eliminar archivo temporal
    fs.unlinkSync(filePath);

    return res.json({ parsed, rawText: fullText });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error processing prescription" });
  }
}
