import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { projectId, statusId, title, description, dueDate, createdById } =
      req.body;
    const task = await Task.create({
      projectId,
      statusId,
      title,
      description,
      dueDate,
      completed: false,
      createdById,
    });
    await Project.findByIdAndUpdate(projectId, {
      $push: { taskIds: task._id },
    });
    res.status(201).json(task);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create task", error: err.message });
  }
});

router.get("/by_statusId/:statusId", async (req, res) => {
  try {
    const { statusId } = req.params;

    const task = await Task.find({ statusId }).sort({ createdAt: 1 });

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch task",
      error: err.message,
    });
  }
});

router.get("/by_projectId/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { completed, fromDate, toDate, isOverdue, isNoExpiration } =
      req.query;

    const query = {
      projectId,
    };

    if (completed !== undefined) {
      query["completed"] = completed === "true";
    }

    const dueDateConditions = {};

    if (fromDate) {
      dueDateConditions["$gte"] = new Date(fromDate);
    }

    if (toDate) {
      dueDateConditions["$lte"] = new Date(toDate);
    }

    if (isNoExpiration === "true") {
      dueDateConditions["$eq"] = null;
    }

    if (isOverdue === "true") {
      dueDateConditions["$gt"] = new Date();
    }

    if (Object.keys(dueDateConditions).length > 0) {
      query["dueDate"] = dueDateConditions;
    }

    const tasks = await Task.find(query).sort({ createdAt: 1 });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById({ id });

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch task",
      error: err.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { statusId, title, description, dueDate, completed } = req.body;
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).send("Task not found");

    task.statusId = statusId || task.statusId;
    task.title = title || task.title;
    task.description =
      description === undefined ? task.description : description;
    task.dueDate = dueDate === undefined ? task.dueDate : dueDate;
    task.completed = completed === undefined ? task.completed : completed;
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    const project = await Project.findById(task.projectId);
    project.taskIds = project.taskIds.filter(
      (taskId) => taskId.toString() !== id
    );

    await project.save();
    await task.deleteOne();
    if (!task) return res.status(404).send("Task not found");
    res.status(204).send("Success");
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
