const router = require("express").Router();
const user = require("../models/user");
const { authenticationtoken } = require("./userauth");

// Add book to favorites
router.put("/add-book-to-favourite", authenticationtoken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const currentuser = await user.findById(id);

        const isbookfavourite = currentuser.favourites.includes(bookid);

        if (isbookfavourite) {
            return res.status(200).json({ message: "Book is already in favorites." });
        }

        // Add the book to favorites
        await user.findByIdAndUpdate(id, { $push: { favourites: bookid } });

        return res.status(200).json({ message: "Book added to favorites." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Remove book from favorites
router.put("/remove-book-from-favourite", authenticationtoken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const currentuser = await user.findById(id);

        const isbookfavourite = currentuser.favourites.includes(bookid);

        if (!isbookfavourite) {
            return res.status(200).json({ message: "Book is not in favorites." });
        }

        // Remove the book from favorites
        await user.findByIdAndUpdate(id, { $pull: { favourites: bookid } });

        return res.status(200).json({ message: "Book removed from favorites." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});



// Get all favorite books for the authenticated user
router.get("/get-favourite-books", authenticationtoken, async (req, res) => {
    try {
        const { id } = req.headers; // Get user ID from headers

        // Find the user by ID
        const currentUser = await user.findById(id).populate('favourites');

        if (!currentUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Fetch all favorite books from the user's favourites array
        const favouriteBooks = currentUser.favourites;
        return res.status(200).json({ books: favouriteBooks });
    
     } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
