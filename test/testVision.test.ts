import vision from "@google-cloud/vision";

async function testVision() {
  const client = new vision.ImageAnnotatorClient();
  const [result] = await client.textDetection("./test-recipe.jpg");
  console.log("Texto detectado:", result.textAnnotations?.[0]?.description);
}

testVision();
