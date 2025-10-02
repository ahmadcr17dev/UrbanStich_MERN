const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerInfo: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        }
    },
    products: [{
        name: String,
        price: Number,
        quantity: Number,
        discount: Number
    }],
    amount: {
        subTotal: Number,
        tax: Number,
        shipping: Number,
        total: Number
    },
    paymentModel: {
        type: String,
        name: ["card", "jazzcash", "easypaisa"],
    },
    status: {
        type: String,
        default: "pending",
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);