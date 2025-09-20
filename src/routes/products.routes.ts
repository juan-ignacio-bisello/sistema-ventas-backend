import { Router } from "express";
import { createProducto, updateProducto, getProductos, deleteProducto } from "../controllers/products";

const router = Router();

router.get("/", getProductos);
router.post("/", createProducto);
router.delete("/", deleteProducto);
router.put("/", updateProducto);

export default router;
