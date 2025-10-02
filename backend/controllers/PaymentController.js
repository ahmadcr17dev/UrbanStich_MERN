const orderSchema = require("../models/OrderModel");
const PaymentSchema = require("../models/PaymentModel");

const ProcessPayment = async (req, res) => {
    try {
        const {
            customerInfo, products, paymentMethod, paymentDetails, amount
        } = req.body;

        // create new order
        const newOrder = await orderSchema.create({
            customerInfo, products, paymentMethod, amount, status: "confirmed",
        });

        // save payment
        const newPayment = await PaymentSchema.create({
            orderId: newOrder._id,
            paymentMethod,
            paymentDetails,
            amount: amount.total,
            status: "success",
        });

        res.status(201).json({
            success: true,
            message: "Payment processed successfully",
            data: {
                orderId: newOrder._id,
                transactionId: newPayment.transactionId,
                amount: amount.total,
            },
        });

    } catch (error) {
        console.error("❌ Payment error:", error);
        res.status(500).json({
            success: false,
            message: "Payment failed",
            error: error.message,
        });
    }
}

module.exports = { ProcessPayment };