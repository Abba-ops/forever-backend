import validator from "validator";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { asyncHandler } from "../utilities/index.js";

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = createToken(user._id);
  res.status(200).json({ success: true, token, message: "Login successful" });
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await userModel.findOne({ email });

  if (exists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  if (!validator.isStrongPassword(password) || !validator.isEmail(email)) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const newUser = await userModel.create({ name, email, password });
  const token = createToken(newUser._id);

  res
    .status(201)
    .json({ success: true, token, message: "User created successfully" });
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = createToken(email + password);
    res.json({ success: true, token, message: "Admin login successful" });
  } else {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }
});

export { loginUser, registerUser, adminLogin };
