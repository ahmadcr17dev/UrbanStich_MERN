const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// SIGNUP
const Signup = async (req, res) => {
    try {
        let { username, email, password, role } = req.body;

        username = username.trim();
        email = email.trim().toLowerCase();

        if (username.length < 5 || username.length > 15) {
            return res.status(400).json({ message: "Username must be between 5 to 15 characters" });
        }

        const passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{7,15}$/;
        if (!passwordregex.test(password)) {
            return res.status(400).json({
                message: "Password must be 7-15 characters and include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
            });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        // Prevent normal users from registering as admin
        if (role && role.toLowerCase() === "admin") {
            return res.status(403).json({ message: "You cannot assign yourself as admin" });
        }

        const newuser = new User({
            username,
            email,
            password: hashpassword,
            role: role || "user"
        });

        await newuser.save();
        res.status(201).json({ message: "User Registered Successfully" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// LOGIN
const Login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const matchpassword = await bcrypt.compare(password, user.password);
        if (!matchpassword) {
            return res.status(400).json({ message: "Invalid Password!" });
        }

        // JWT Token with Role included
        const token = jwt.sign(
            { id: user._id, role: user.role },
            "hello",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login Successful!",
            role: user.role,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { Signup, Login };
