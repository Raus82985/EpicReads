require("dotenv").config();  // Load environment variables
const jwt = require("jsonwebtoken");

const authenticationtoken = (req, res, next) => {
    const authheader = req.headers["authorization"];
    console.log(authheader);
    
    const token = authheader && authheader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication token required" });
    }

    const jwtSecret = process.env.JWT;  // Use environment variable or default

    if (!jwtSecret) {
        return res.status(500).json({ message: "Server error: JWT secret not found" });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(403).json({ message: "Token expired. Please sign in again." });
            }
            return res.status(403).json({ message: "Invalid token. Please sign in again." });
        }

        req.user = decoded;  // Attach the decoded token payload to the request
        next();  // Proceed to the next middleware/route handler
    });
};

module.exports = { authenticationtoken };
