import Stripe from "stripe";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { asyncHandler } from "../utilities/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const currency = "INR";
const deliveryCharge = 10;

const placeOrder = asyncHandler(async (req, res) => {
  const { userId, items, amount, address } = req.body;
  const orderData = {
    userId,
    items,
    amount,
    address,
    paymentMethod: "COD",
    payment: false,
  };

  const newOrder = new orderModel(orderData);
  await newOrder.save();
  await userModel.findByIdAndUpdate(userId, { cartData: {} });

  res.json({ success: true, message: "Order placed successfully." });
});

const allOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find({});
  res.json({
    success: true,
    message: "Orders retrieved successfully.",
    data: orders,
  });
});

const userOrders = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const orders = await orderModel.find({ userId });
  res.json({
    success: true,
    message: "User orders retrieved successfully.",
    data: orders,
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  await orderModel.findByIdAndUpdate(orderId, { status });
  res.json({ success: true, message: "Order status updated successfully." });
});

const placeOrderStripe = asyncHandler(async (req, res) => {
  const { userId, items, amount, address } = req.body;
  const { origin } = req.headers;

  const orderData = {
    userId,
    items,
    amount,
    address,
    paymentMethod: "Stripe",
    payment: false,
  };

  const newOrder = new orderModel(orderData);
  await newOrder.save();

  const line_items = items.map((item) => ({
    price_data: {
      currency,
      product_data: { name: item.name },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  line_items.push({
    price_data: {
      currency,
      product_data: { name: "Delivery Charges" },
      unit_amount: deliveryCharge * 100,
    },
    quantity: 1,
  });

  const session = await stripe.checkout.sessions.create({
    success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    line_items,
    mode: "payment",
  });

  res.json({ success: true, session_url: session.url });
});

const verifyStripe = asyncHandler(async (req, res) => {
  const { orderId, userId, success } = req.body;

  if (success === "true") {
    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Payment verified successfully." });
  } else {
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: false, message: "Payment verification failed." });
  }
});

const placeOrderRazorpay = asyncHandler(async (req, res) => {});

export {
  allOrders,
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateStatus,
  userOrders,
  verifyStripe,
};
