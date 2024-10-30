import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import connectCloudinary from "./config/cloudinary.js";
import connectDatabase from "./config/mongoose.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();
const port = process.env.PORT || 4000;

connectDatabase();
connectCloudinary();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: [
    "https://forever-admin-roan.vercel.app/",
    "https://forever-app.vercel.app/",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => res.send("Hello World!"));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Listening on ${port}`));
