import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
// import { check } from "express-validator";
import verify from "../middleware/verify.js";

const router = express.Router();

// GET tất cả người dùng
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    // await User.deleteMany({});
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST thêm người dùng
router.post("/", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // todo: check unique mail
    const isUnique = await User.findOne({ email: email });
    if (isUnique) {
      res.status(401).json({ message: "Email exist" });
      return;
    }

    //hash pasword
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hash,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

//login return token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    //check email
    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });
    }
    //data without password
    const userData = { ...user._doc };
    delete userData.password;
    const token = user.generateAccessJWT();

    // send success response
    return res.status(200).json({
      status: "success",
      token,
      data: userData,
      message: "You have successfully logged in.",
    });
  } catch (err) {
    // server error
    console.error("Error during login:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

//Get me từ token
router.get("/me", verify, async (req, res) => {
  try {
    const user = req.user;
    const userData = { ...user._doc };
    delete userData.password; // xóa password nếu có
    res.status(200).json({
      status: "success",
      data: userData,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH cập nhật người dùng
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found");

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    await user.save();
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET user by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE xóa người dùng
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).send("User not found");
    res.status(204).send("User deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
