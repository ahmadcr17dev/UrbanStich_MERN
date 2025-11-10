const express = require("express");
const upload = require("../config/multer"); // Cloudinary multer config
const router = express.Router();

const {
    AddProduct,
    DisplayProduct,
    DeleteProduct,
    GetSingleProduct,
    GetRelatedProducts,
    UpdateProduct,
} = require("../controllers/ProductController");

// Routes
router.get("/products/related", GetRelatedProducts);

// ✅ Use `.single('image')` or `.array('images')` depending on how you upload
router.post("/products", upload.any("image"), AddProduct);

router.get("/displayproducts", DisplayProduct);
router.delete("/:id", DeleteProduct);
router.get("/products/:id", GetSingleProduct);
router.put("/:id", UpdateProduct);

module.exports = router;