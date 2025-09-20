import { Router } from "express";
import { uploadPrescription } from '../controllers/prescription.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.post("/upload", upload.single("file"), uploadPrescription);

export default router;
