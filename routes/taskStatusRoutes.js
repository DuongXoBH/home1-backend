import express from "express";
import Project from "../models/Project.js";
import TaskStatus from "../models/TaskStatus.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { projectId, title, order } = req.body;
    const status = await TaskStatus.create({ projectId, title, order });
    await Project.findByIdAndUpdate(projectId, {
      $push: { taskStatusIds: status._id },
    });
    res.status(201).json(status);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create task status", error: err.message });
  }
});

router.get("/by_projectId/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const statuses = await TaskStatus.find({ projectId }).sort({ order: 1 });

    res.status(200).json(statuses);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch task statuses",
      error: err.message,
    });
  }
});

router.get("/by_statusId/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const taskStatus = await TaskStatus.findById(id);

    res.status(200).json(taskStatus);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch task status",
      error: err.message,
    });
  }
});
export default router;
