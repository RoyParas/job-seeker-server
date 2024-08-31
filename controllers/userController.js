import asyncHandler from "express-async-handler";
import ErrorHandler from "../middlewares/errorHandler.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please Enter all the fields!",400));
  }

  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already taken!",400));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });
  sendToken(user, 201, res, "User Registered Successfully!");
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(
      new ErrorHandler("Please Enter the Fields Mandatory for Login!", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password!", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or Password!", 400));
  }
  if (role != user.role) {
    return next(new ErrorHandler("User with Entered Role Not Found!", 404));
  }
  sendToken(user, 200, res, "User Logged in Succesfully!");
});

export const logout = asyncHandler(async (req, res, next) => {
  res.status(200).cookie("token","",{
    httpOnly:true,
    expires: new Date(Date.now()),
    secure: true,
    sameSite: "None",
  }).json({
    success:true,
    message:"User logged Out Successfully!!",
  });
});

export const getUser = asyncHandler((req,res,next)=>{
  const user = req.user;
  res.status(200).json({
    success:true,
    user
  })
})
