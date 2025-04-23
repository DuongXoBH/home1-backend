import express from "express";
import Article from "../models/Article.js"; // Đường dẫn đến model bạn đã tạo
const router = express.Router();

// Lấy tất cả article
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
});

// Tạo article mới
router.post("/", async (req, res) => {
  const { title, description, content, url, image, publishedAt, source } =
    req.body;

  if (!title || !url || !publishedAt || !source?.name || !source?.url) {
    return res.status(400).json({ message: "Thiếu trường bắt buộc." });
  }

  try {
    const newArticle = new Article({
      title,
      description,
      content,
      url,
      image,
      publishedAt,
      source,
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo article", error: err });
  }
});

// Lấy article theo ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Không tìm thấy article" });
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
});

router.post("/bulk", async (req, res) => {
  const articles = req.body.articles;

  if (!Array.isArray(articles) || articles.length === 0) {
    return res
      .status(400)
      .json({ message: "Cần truyền vào một mảng articles hợp lệ." });
  }

  try {
    const inserted = await Article.insertMany(articles);
    res.status(201).json(inserted);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lưu danh sách bài viết", error: err });
  }
});

export default router;
