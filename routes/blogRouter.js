import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

// Lấy tất cả blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
});

// Tạo blog mới
router.post("/", async (req, res) => {
  const { img, tittleText, nameText, descriptionText } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!img || !tittleText || !nameText || !descriptionText) {
    return res.status(400).json({ message: "Tất cả các trường là bắt buộc." });
  }

  try {
    const newBlog = new Blog({
      img,
      tittleText,
      nameText,
      descriptionText, 
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo blog", error: err });
  }
});

// Get by id
router.get("/:id", async (req, res) => {
  const {id} = req.params;
  try {
    const blog = await Blog.findById(id);
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
});
//Get by page
router.get("/page/:page", async(req, res) => {
  const page = req.params.page;
  try {
    const blogs = await Blog.find();
    const blogsGroup = [];
    
    blogs.forEach((element,index)=>{
      if (Math.ceil((index+1)/3) == page) {
        blogsGroup.push(element);
      }
    })
    res.status(200).json({
      data: blogsGroup,
      itemsCount: blogs.length
    });
    console.log("🚀 ~ router.get ~ blogsGroup:", blogsGroup)

  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: err });

  }
})
export default router;
