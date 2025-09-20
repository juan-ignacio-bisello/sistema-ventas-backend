import { Router } from "express";
import { uploadPrescription } from "../controllers/prescription.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.post("/upload", upload.single("file"), uploadPrescription);

router.get("/prueba", (_req, res) => {
  res.json({
    ok: true,
    message: "prueba completa",
  });
});

export default router;
