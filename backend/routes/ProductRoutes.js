const express = require("express");
const upload = require("../config/multer");
const router = express.Router();   // ✅ use Router
const { AddProduct, DisplayProduct, DeleteProduct, GetSingleProduct, GetRelatedProducts, UpdateProduct } = require("../controllers/ProductController");

router.get("/products/related", GetRelatedProducts);
router.post("/products", upload, AddProduct);
router.get("/displayproducts", DisplayProduct);
router.delete("/:id", DeleteProduct);
router.get("/products/:id", GetSingleProduct);
router.put("/:id", UpdateProduct);

module.exports = router;