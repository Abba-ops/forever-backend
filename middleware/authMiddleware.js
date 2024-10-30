import jwt from "jsonwebtoken";
import { asyncHandler } from "../utilities/index.js";

const isAdmin = asyncHandler((req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    res.status(401);
    throw new Error("No token provided for admin authentication");
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (
    decodedToken.id !==
    process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
  ) {
    res.status(403);
    throw new Error("Invalid token for admin authentication");
  }

  next();
});

const isLoggedIn = asyncHandler((req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decodedToken.id;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Invalid token");
  }
});

export { isAdmin, isLoggedIn };
