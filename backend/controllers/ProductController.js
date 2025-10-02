const productSchema = require("../models/ProductModel");
const fs = require("fs");

const AddProduct = async (req, res) => {
  try {
    const { productid, name, category, subcategory, description, brand, discount, variations } = req.body;

    // search if product already exist or not
    const existedproduct = await productSchema.findOne({ productid });
    if (existedproduct) {
      return res.status(400).json({ message: "Product ID Already Existed" });
    }

    const parsedVariations = JSON.parse(variations); // parse JSON

    // Map uploaded files dynamically
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // filename format: variation_<idx>_mainImage or variation_<idx>_gallery
        const match = file.fieldname.match(/variation_(\d+)_(mainImage|gallery)/);
        if (match) {
          const idx = Number(match[1]);
          const type = match[2]; // mainImage or gallery
          if (!parsedVariations[idx]) return;

          if (type === "mainImage") {
            parsedVariations[idx].mainImage = file.filename;
          } else {
            if (!parsedVariations[idx].galleryImages) parsedVariations[idx].galleryImages = [];
            parsedVariations[idx].galleryImages.push(file.filename);
          }
        }
      });
    }

    const newProduct = new productSchema({
      productid,
      name,
      category,
      subcategory,
      description,
      brand,
      discount,
      variations: parsedVariations,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });

  } catch (err) {
    console.error("AddProduct Error:", err);
    res.status(500).json({ message: err.message });
  }
};

const DisplayProduct = async (req, res) => {
  try {
    const products = await productSchema.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const DeleteProduct = async (req, res) => {
  try {
    await productSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `${productSchema.name} has been deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const GetSingleProduct = async (req, res) => {
  try {
    const product = await productSchema.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const GetRelatedProducts = async (req, res) => {
  try {
    const { category, excludeId } = req.query;  // from query params

    const relatedProducts = await productSchema.find({
      category,
      _id: { $ne: excludeId }   // exclude current product
    }).limit(4);

    res.status(200).json(relatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const UpdateProduct = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    const updateProduct = await productSchema.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updateProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updateProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { AddProduct, DisplayProduct, DeleteProduct, GetSingleProduct, GetRelatedProducts, UpdateProduct };