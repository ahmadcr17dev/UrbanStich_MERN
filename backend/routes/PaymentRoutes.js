const express = require("express");
const router = express.Router();
const { ProcessPayment } = require("../controllers/PaymentController");

// process payment
router.post("/process", ProcessPayment);

module.exports = router;