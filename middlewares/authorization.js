import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import ErrorHandler from "./errorHandler.js";

export const isAuthorized = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User not authorized", 400));
  }

  const decoded = jwt.verify(token, process.env.access_token_secret);

  req.user = await User.findById(decoded.id);
  
  next();
});
