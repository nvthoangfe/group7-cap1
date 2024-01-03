import express from "express";
import { CreateOrder, GetAllOrders, GetOrderById, updateOrderStatusPayment } from "../app/controllers/Order.controller.js";
const router = express.Router();


// get all orders
router.get("/", GetAllOrders);

router.get("/user/:id", GetOrderById);
// 
router.post("/", CreateOrder);
router.put("/:id", updateOrderStatusPayment);
export default router;
