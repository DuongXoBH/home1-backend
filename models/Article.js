import mongoose from "mongoose";

const SourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String },
  url: { type: String, required: true },
  image: { type: String },
  publishedAt: { type: Date, required: true },
  source: { type: SourceSchema, required: true },
});

export default mongoose.models.Article ||
  mongoose.model("Article", ArticleSchema);
