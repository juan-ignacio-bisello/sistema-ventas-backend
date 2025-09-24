import { ImageAnnotatorClient } from '@google-cloud/vision';

export async function extractText(base64Image: string): Promise<string> {
  try {
    // Crea el cliente de Vision
    const client = process.env.GOOGLE_APPLICATION_CREDENTIALS
      ? new ImageAnnotatorClient({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS })
      : new ImageAnnotatorClient();

    // Envía la imagen con hint de idioma español
    const [result] = await client.textDetection({
      image: { content: Buffer.from(base64Image, 'base64') },
      imageContext: { languageHints: ['es'] }, // Fuerza detección en español
    });

    // Extrae el texto completo
    const detections = result.textAnnotations;
    if (detections && detections.length > 0 && detections[0]) {
      return detections[0].description || '';
    }

    return '';
  } catch (error) {
    console.error("Error en extractText con Google Vision:", error);
    throw error;
  }
}