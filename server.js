import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import taskStatusRoutes from "./routes/taskStatusRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import { MONGO_URI, PORT } from "./config/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/user", userRoutes);
app.use("/projects", projectRoutes);
app.use("/files", fileRoutes);
app.use("/task", taskRoutes);
app.use("/task_status", taskStatusRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port 5000");
});
