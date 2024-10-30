import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controllers/cartController.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.post("/get", isLoggedIn, getUserCart);
cartRouter.post("/add", isLoggedIn, addToCart);
cartRouter.post("/update", isLoggedIn, updateCart);

export default cartRouter;
