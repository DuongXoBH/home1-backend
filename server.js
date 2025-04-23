import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import orderPaymentRoutes from "./routes/orderPaymentRoutes.js";
import { MONGO_URI, PORT } from "./config/index.js";
import dotenv from "dotenv";
dotenv.config();

// Cấu hình CORS và Body Parser
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Đăng ký các route
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);
app.use("/orders", orderRoutes);
app.use("/orders_payment", orderPaymentRoutes);
app.use("/articles", articleRoutes);

// Lắng nghe trên cổng 5000
app.listen(PORT, () => {
  console.log("Server is running on port 5000");
});
