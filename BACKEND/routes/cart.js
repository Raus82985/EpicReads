const router = require("express").Router();
const user = require("../models/user");
const { authenticationtoken } = require("./userauth");

// Add book to cart
router.put("/add-book-to-cart", authenticationtoken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const currentUser = await user.findById(id);

        const isBookInCart = currentUser.cart.includes(bookid);

        if (isBookInCart) {
            return res.status(200).json({ message: "Book is already in Cart." });
        }

        // Add the book to cart
        await user.findByIdAndUpdate(id, { $push: { cart: bookid } });

        return res.status(200).json({ message: "Book added to Cart." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});
 
// Remove book from cart
router.put("/remove-book-from-cart", authenticationtoken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const currentUser = await user.findById(id);

        const isBookInCart = currentUser.cart.includes(bookid);

        if (!isBookInCart) {
            return res.status(200).json({ message: "Book is not in Cart." });
        }

        // Remove the book from cart
        await user.findByIdAndUpdate(id, { $pull: { cart: bookid } });

        return res.status(200).json({ message: "Book removed from Cart." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Get all books in cart
router.get("/get-user-cart", authenticationtoken, async (req, res) => {
    try {
        const { id } = req.headers; // Get user ID from headers

        // Find the user by ID and populate cart
        const currentUser = await user.findById(id).populate('cart');

        if (!currentUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Fetch all books from the user's cart array
        const cart = currentUser.cart.reverse(); 
        return res.status(200).json({ data: cart });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
