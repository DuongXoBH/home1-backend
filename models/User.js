import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN, SECRET_REFRESH_TOKEN } from "../config/index.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, require: true },
    avatar: { type: String, optional: true },
  },
  { timestamps: true }
);
userSchema.methods.generateAccessJWT = function () {
  let payload = {
    id: this._id,
  };
  return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
    expiresIn: "1d",
  });
};
userSchema.methods.generateRefreshJWT = function () {
  let payload = {
    id: this._id,
  };
  return jwt.sign(payload, SECRET_REFRESH_TOKEN, {
    expiresIn: "1d",
  });
};
const User = mongoose.model("User", userSchema);

export default User;
