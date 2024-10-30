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

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => res.send("Hello World!"));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Listening on ${port}`));
