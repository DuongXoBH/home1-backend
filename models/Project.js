import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    taskStatusIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TaskStatus" },
    ],
    taskIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    recentlyAccessedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
