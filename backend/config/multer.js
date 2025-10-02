const multer = require("multer");
const path = require("path");

// Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only images are allowed"), false);
};

// Dynamic Multer: accepts any variation main or gallery images
const upload = multer({ storage, fileFilter }).any();

module.exports = upload;
