const express = require("express");
const { Signup, Login } = require("../controllers/AuthController");
const { verifyAdmin } = require("../middlewares/Auth.js");

const router = express.Router();

router.post("/register", Signup);
router.post("/login", Login);
router.get("/admin", verifyAdmin, (req, res) => {
    res.json({ message: "Welcome to the main Dashboard" });
})

module.exports = router;