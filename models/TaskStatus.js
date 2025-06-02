import mongoose from "mongoose";

const taskStatusSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  title: { type: String, required: true },
  order: { type: Number, required: true },
});

export default mongoose.model("TaskStatus", taskStatusSchema);
