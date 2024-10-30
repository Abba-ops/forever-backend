import userModel from "../models/userModel.js";
import { asyncHandler } from "../utilities/index.js";

const addToCart = asyncHandler(async (req, res) => {
  const { userId, itemId, size } = req.body;
  const userData = await userModel.findById(userId);
  const cartData = userData.cartData;

  cartData[itemId] = cartData[itemId] || {};
  cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

  await userModel.findByIdAndUpdate(userId, { cartData });
  res.json({ success: true, message: "Item added to cart" });
});

const updateCart = asyncHandler(async (req, res) => {
  const { userId, itemId, size, quantity } = req.body;
  const userData = await userModel.findById(userId);
  const cartData = userData.cartData;

  cartData[itemId][size] = quantity;

  await userModel.findByIdAndUpdate(userId, { cartData });
  res.json({ success: true, message: "Cart updated" });
});

const getUserCart = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const userData = await userModel.findById(userId);

  res.json({
    success: true,
    message: "Cart retrieved",
    data: userData.cartData,
  });
});

export { addToCart, getUserCart, updateCart };
