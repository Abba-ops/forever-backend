import express from "express";
import {
  allOrders,
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateStatus,
  userOrders,
  verifyStripe,
} from "../controllers/orderController.js";
import { isAdmin, isLoggedIn } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/list", isAdmin, allOrders);
orderRouter.post("/status", isAdmin, updateStatus);

orderRouter.post("/place", isLoggedIn, placeOrder);
orderRouter.post("/stripe", isLoggedIn, placeOrderStripe);
orderRouter.post("/razorpay", isLoggedIn, placeOrderRazorpay);

orderRouter.post("/userorders", isLoggedIn, userOrders);
orderRouter.post("/verifystripe", isLoggedIn, verifyStripe);

export default orderRouter;
