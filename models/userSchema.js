import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Provide Your Email"],
    validate: [validator.isEmail, "Please Provide a valid email"],
  },
  phone: {
    type: Number,
    required: [true, "Please Provide Your Number"],
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
    minlength: [8, "Minimum password length must be 8"],
    maxlength: [25, "Password length cannot cross 25 characters"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Please Provide Your Role"],
    enum: ["Job Seeker", "Employer"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Hashing The Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Comparing The Password
userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating a JWT token for authorization
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.access_token_secret, {
    expiresIn: "1d",
  });
};

export const User = mongoose.model("User", userSchema);
