import express from "express";
import Project from "../models/Project.js";
import TaskStatus from "../models/TaskStatus.js";
import Task from "../models/Task.js";
import verify from "../middleware/verify.js";

const router = express.Router();

router.post("/", async (req, res) => {
  // delete all projects
  // const projects = await Project.find();

  // for (const project of projects) {
  //   await Task.deleteMany({ projectId: project._id });
  //   await TaskStatus.deleteMany({ projectId: project._id });
  //   await Project.findByIdAndDelete(project._id);
  // }
  try {
    const { name, memberIds, createdById, images } = req.body;
    const memberId = Array.isArray(memberIds) ? req.body.memberIds : [];
    const defaultImages = [
      "https://res.cloudinary.com/dtg8bciwm/image/upload/v1749174212/images/gidlgfldzkjxf7gaty7d.jpg",
      "https://res.cloudinary.com/dtg8bciwm/image/upload/v1749174233/images/ckpvlruihjgrfsueui4s.jpg",
      "https://res.cloudinary.com/dtg8bciwm/image/upload/v1749174249/images/uctqkxx7qocyxpeqxndh.jpg",
      "https://res.cloudinary.com/dtg8bciwm/image/upload/v1749174266/images/d86noqmgna89a9y5bqcj.jpg",
      "https://res.cloudinary.com/dtg8bciwm/image/upload/v1749174277/images/wnlgx8wlicpe67lkqy8f.jpg",
    ];
    const project = await Project.create({
      name,
      image: images ? images : defaultImages[Math.ceil(Math.random() * 3) - 1],
      createdById,
      memberIds: [...new Set([...memberId, createdById])],
      recentlyAccessedAt: new Date(),
    });

    res.status(201).json(project);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create project", error: err.message });
  }
});

router.get("/byMe/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ createdById: userId }).sort({
      recentlyAccessedAt: -1,
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch projects",
      error: err.message,
    });
  }
});

router.get("/asGuest/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({
      memberIds: userId,
      createdById: { $ne: userId },
    }).sort({
      recentlyAccessedAt: -1,
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch projects",
      error: err.message,
    });
  }
});

router.get("/recently/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Project.find({
      memberIds: userId,
    })
      .sort({ recentlyAccessedAt: -1 })
      .limit(4);

    res.json(projects);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch recently accessed projects",
      error: err.message,
    });
  }
});

router.get("/:id", verify, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project.memberIds.includes(req.user?._id))
      return res.status(403).json({ message: "Forbidden" });
    project.recentlyAccessedAt = new Date();
    await project.save();
    res.json(project);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch project", error: err.message });
  }
});
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { memberIds } = req.body;
  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("project not found");

    project.memberIds = memberIds || project.memberIds;
    await project.save();
    res.status(200).json(project);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.delete("/projects/:id", verify, async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.createdById.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this project" });
    }

    await Task.deleteMany({ projectId });

    await TaskStatus.deleteMany({ projectId });

    await Project.findByIdAndDelete(projectId);

    res
      .status(200)
      .json({ message: "Project and related data deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete project", error: err.message });
  }
});

export default router;
