import { Request, Response } from "express";
import fs from "fs";
import sharp from "sharp";
import { extractText } from "../service/vision.service";
import { parsePrescription } from "../service/parce.service";

export async function uploadPrescription(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const processedPath = `temp_${Date.now()}.png`; // Nombre único para la imagen procesada

  try {
    // Debug detallado del archivo subido
    console.log("req.file:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer ? "Present" : "Missing",
      bufferLength: req.file.buffer ? req.file.buffer.length : "N/A",
    });

    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ error: "Invalid or empty file buffer" });
    }

    // Paso 1: Preprocesar imagen con Sharp usando el buffer
    await sharp(req.file.buffer)
      .grayscale()
      .normalize()
      .threshold(150)
      .resize(1024)
      .toFile(processedPath);

    // Lee la procesada como buffer y convierte a base64
    const processedBuffer = await fs.promises.readFile(processedPath);
    const base64Image = processedBuffer.toString('base64');

    // Paso 2: Extraer texto con Google Cloud Vision
    const fullText = await extractText(base64Image);
    console.log("Texto extraído por Vision:", fullText);

    // Paso 3: Parsear el texto extraído
    const parsed = parsePrescription(fullText);

    res.json({ parsed, rawText: fullText });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error en uploadPrescription:", error.message, error.stack);
    } else {
      console.error("Error en uploadPrescription:", error);
    }
    res.status(500).json({ error: "Error processing prescription" });
  } finally {
    try {
      if (fs.existsSync(processedPath)) await fs.promises.unlink(processedPath);
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