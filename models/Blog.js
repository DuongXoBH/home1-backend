import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  img: { type: String, required: true },
  tittleText: { type: String, required: true },
  nameText: { type: String, required: true },
  descriptionText: { type: String, required: true },
},{timestamps: true});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
