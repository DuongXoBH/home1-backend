import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
// import { check } from "express-validator";
import verify from "../middleware/verify.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    // await User.deleteMany({});
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  const { name, email, password, role, avatar } = req.body;
  try {
    // todo: check unique mail
    const isUnique = await User.findOne({ email: email });
    if (isUnique) {
      res.status(401).json({ message: "Email exist" });
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      email: email,
      password: hash,
      role,
      avatar,
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
    const accessToken = user.generateAccessJWT();
    const refreshToken = user.generateRefreshJWT();

    // send success response
    return res.status(200).json({
      status: "success",
      accessToken,
      refreshToken,
      data: userData,
      message: "Login successful.",
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

//refresh token
router.post("/auth/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = user.generateAccessJWT();
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
});

//Get me từ token
router.get("/me", verify, async (req, res) => {
  try {
    const user = req.user;
    const userData = { ...user._doc };
    delete userData.password; // xóa password nếu có
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password, avatar } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found");

    user.name = name !== undefined ? name : user.name;
    user.email = email !== undefined ? email : user.email;
    user.password = password !== undefined ? password : user.password;
    user.avatar = avatar !== undefined ? avatar : user.avatar;
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
router.get("/avatar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json(user.avatar);
  } catch (error) {
    res.status(500).send(error);
  }
});

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
