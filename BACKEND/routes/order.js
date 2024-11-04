const router = require("express").Router();
const user = require("../models/user");
const order = require("../models/order"); // Ensure to import your Order model
const { authenticationtoken } = require("./userauth");

// Add book to order
router.post("/add-book-to-order", authenticationtoken, async (req, res) => {
    try {
        const { id } = req.headers; // User ID from headers
        const { order: orderItems } = req.body; // Order items from request body

        // Validate that the order is an array and contains items
        if (!Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).json({ message: "Invalid order data." });
        }

        // Process each order item
        for (const orderData of orderItems) {
            const newOrder = new order({
                user: id,
                book: orderData._id,
            });

            const orderDataFromDb = await newOrder.save();

            // Add order data to user order history
            await user.findByIdAndUpdate(id, {
                $push: { orders: orderDataFromDb._id },
            });

            // Remove from user cart
            await user.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id },
            });
        }

        return res.status(200).json({ message: "Order placed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Get order history of a particular user
router.get("/get-order-history", authenticationtoken, async (req, res) => {
    try {
        const { id } = req.headers; // Get user ID from headers

        // Find the user by ID and populate their orders
        const currentUser = await user.findById(id).populate({
            path: "orders",
            populate: { path: "book" }, // Assuming book references are populated
        });

        // Fetch all orders from the user's order array
        const orderData = currentUser.orders.reverse();
        return res.status(200).json({ books: orderData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Get order history of all users
router.get("/get-all-orders", authenticationtoken, async (req, res) => {
    try {
        // Find all orders and populate user and book details
        const orderData = await order.find()
            .populate({ path: "book" })
            .populate({ path: "user" })
            .sort({ createdAt: -1 }); // Sort orders by creation date

        return res.status(200).json({ books: orderData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Update order status (admin only)
// Update order status (admin only)
router.put("/update-status/:id", authenticationtoken, async (req, res) => {
    try {
        const { id } = req.params; // Order ID from params
        const { status } = req.body; // New status from request body
        

        if (!status) {
            return res.status(400).json({ message: "Status is required." });
        }

        const userId = req.headers.id;
        const adminUser = await user.findById(userId);

        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const updatedOrder = await order.findByIdAndUpdate(id, { status }, { new: true });

        // If the order status is set to "Delivered," add the book to the user's purchasedBooks
        if (status === "Delivered") {
            
            const userToUpdate = await user.findById(updatedOrder.user);

            // Check if the book is already in purchasedBooks
            if (!userToUpdate.purchasedBooks.includes(updatedOrder.book)) {
                userToUpdate.purchasedBooks.push(updatedOrder.book);
                await userToUpdate.save();                
            }
        }

        return res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});


module.exports = router;
