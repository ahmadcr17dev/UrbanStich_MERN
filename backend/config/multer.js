const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // example: 'yourname'
  api_key: process.env.CLOUDINARY_API_KEY,       // example: '123456789'
  api_secret: process.env.CLOUDINARY_API_SECRET, // example: 'abcxyz'
});

// Set up storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder name on Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto" }],
  },
});

// Multer upload middleware
const upload = multer({ storage });

module.exports = upload;