import express from "express";
import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hàm xử lý upload stream cho Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "images",
        resource_type: "image",
        transformation: [
          {
            width: 1080,
            height: 608,
            crop: "fill",
            quality: "100",
            format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Route xử lý upload ảnh
router.post("/upload-images", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(file.buffer);

    return res.status(200).json({
      url: result.secure_url,
    });
  } catch (err) {
    console.error("🚨 Upload error:", err);
    return res
      .status(500)
      .json({ message: "Upload failed", error: err.message });
  }
});

export default router;
