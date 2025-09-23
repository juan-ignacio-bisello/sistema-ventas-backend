import { Request, Response } from "express";
import fs from "fs";
import sharp from "sharp";
import { extractText } from "../service/vision.service";
import { parsePrescription } from "../service/parce.service";

export async function uploadPrescription(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;
  const processedPath = filePath + "_clean.png";

  try {
    // Paso 1: Preprocesar imagen
    await sharp(filePath)
      .grayscale()
      .normalize()
      .threshold(150) // binarización
      .toFile(processedPath);

    // Paso 2: Mandar imagen procesada a Vision AI
    const fullText = await extractText(processedPath);

    // Paso 3: Parsear con tus reglas
    const parsed = parsePrescription(fullText);

    res.json({ parsed, rawText: fullText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing prescription" });
  } finally {
    // Limpieza de archivos temporales
    try {
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(processedPath);
    } catch (e) {
      console.warn("No se pudo borrar tmp:", e);
    }
  }
}

export const pruebaGet = (req: Request, res: Response) => {
  res.json({
    ok: true,
    message: "crearProducto",
  });
};
