const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    paymentMethod: String,
    paymentDetails: Object,
    amount: Number,
    status: {
        type: String,
        default: "success"
    },
    transactionId: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
    }
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);