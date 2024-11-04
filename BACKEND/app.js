const express = require("express");
const app = express();
const cors = require("cors")
require("dotenv").config();               // Load environment variables
require("./connection/connection.js");    // Database connection (ensure below dotenv)

const userRoutes = require("./routes/user.js");
const bookRoutes = require("./routes/book.js");
const favouriteRoutes = require("./routes/favourite.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
const promoRoutes = require("./routes/promo.js");
// const promoRoutes = require("./routes/promo.js");



// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming requests with JSON payloads

// Routes
app.use("/api/v1", userRoutes); // Set up your user routes
app.use("/api/v1", bookRoutes); // Set up your book routes 
app.use("/api/v1", favouriteRoutes); // Set up your favourite routes 
app.use("/api/v1", cartRoutes); // Set up your cart routes 
app.use("/api/v1", orderRoutes); // Set up your cart routes 
app.use("/api/v1", promoRoutes); // Set up your cart routes 

// Handle non-existent routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start server and listen on port
const PORT = process.env.PORT || 5000; // Fallback to port 5000 if not specified
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
