const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No Token Provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid Token" });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === "Admin") {
            next();
        } else {
            res.status(403).json({ message: "Access Denied" });
        }
    })
};

module.exports = { verifyToken, verifyAdmin };