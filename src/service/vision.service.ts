import vision from "@google-cloud/vision";
import fs from "fs";

const visionClient = new vision.ImageAnnotatorClient(
  process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? { keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS }
    : {}
);

export async function extractText(filePath: string): Promise<string> {
  const [result] = await visionClient.documentTextDetection({
    image: { content: fs.readFileSync(filePath) },
  });

  return result.fullTextAnnotation?.text || "";
}
