import express from "express";
import { CreateProduct, DeleteProduct, GetAllProducts, GetProductById, UpdateProduct } from "../app/controllers/Products.controller.js";
const router = express.Router();

// router.put("/:id", UpdateEvaluate);

// router.delete("/:id", DeleteEvaluate);

// get with receipt id
// router.post("/receipt_id", GetEvaluateByIdReceipt);

// get with limit 3
// router.get("/limit", GetEvaluateLimit3);

// get all product
router.get("/", GetAllProducts);
router.get("/:id", GetProductById);
router.delete("/:id", DeleteProduct);

router.post("/", CreateProduct);
router.put("/:id", UpdateProduct);

export default router;
