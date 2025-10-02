const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
    size: { type: String, required: true },
    stock: { type: Number, default: 0 },
});

const variationSchema = new mongoose.Schema({
    color: { type: String, required: true },
    price: { type: Number, required: true },
    sizes: [sizeSchema],
    mainImage: { type: String },
    galleryImages: [String],
});

const productSchema = new mongoose.Schema({
    productid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    discount: { type: Number, default: 0 },
    variations: [variationSchema],
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);