const router = require("express").Router();
const user = require("../models/user");
const { authenticationtoken } = require("./userauth");
const book = require("../models/book");

// Helper function to check if user is an admin
const isAdmin = (currentUser) => currentUser && currentUser.role === "admin";

// Add a new book
router.post("/add-book", authenticationtoken, async (req, res) => {
    try {
        const currentUser = req.user; // Access the current user from req.user

        // Check if user is admin
        if (!isAdmin(currentUser)) {
            return res.status(403).json({ message: "Access denied: You do not have permission to perform this action." });
        }

        const { url, title, author, Price, Descreption, language, pdfurl } = req.body;

        // Validate required fields
        if (!url || !title || !author || Price === undefined || !Descreption || !language) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check for duplicate book by title and author
        const existingBook = await book.findOne({ title, author });
        if (existingBook) {
            return res.status(400).json({ message: "This book already exists." });
        }

        // Create a new book instance
        const newBook = new book({ url, title, author, Price, Descreption, language, pdfurl });

        // Save the new book to the database
        await newBook.save();

        // Return success response
        return res.status(201).json({ message: "Book added successfully", book: newBook });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Update an existing book
router.put("/update-book", authenticationtoken, async (req, res) => {
    try {
        const currentUser = req.user; // Access the current user from req.user
        const bookId = req.headers.bookid; // Get book ID from request headers

        // Check if the user is an admin
        if (!isAdmin(currentUser)) {
            return res.status(403).json({ message: "You are not authorized to perform this action." });
        }

        // Find the existing book
        const existingBook = await book.findById(bookId);
        if (!existingBook) {
            return res.status(404).json({ message: "Book not found." });
        }

        // Update the book fields with the data from the request body
        const { url, title, author, Price, Descreption, language, pdfurl } = req.body;

        // Only update the fields that were provided in the request body
        if (url) existingBook.url = url;
        if (title) existingBook.title = title;
        if (author) existingBook.author = author;
        if (Price !== undefined) existingBook.Price = Price; // Allow 0 as a valid price
        if (Descreption) existingBook.Descreption = Descreption;
        if (language) existingBook.language = language;
        if (pdfurl) existingBook.pdfurl = pdfurl;

        // Save the updated book to the database
        await existingBook.save();

        // Return success response with updated book details
        return res.status(200).json({ message: "Book updated successfully", book: existingBook });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Delete an existing book
router.delete("/delete-book", authenticationtoken, async (req, res) => {
    try {
        const currentUser = req.user; // Access the current user from req.user
        const bookId = req.headers.bookid; // Get book ID from request headers

        // Check if the user is an admin
        if (!isAdmin(currentUser)) {
            return res.status(403).json({ message: "You are not authorized to perform this action." });
        }

        // Find the existing book
        const existingBook = await book.findById(bookId);
        if (!existingBook) {
            return res.status(404).json({ message: "Book not found." });
        }

        // Delete the book
        await book.findByIdAndDelete(bookId);

        // Return success response
        return res.status(200).json({ message: "Book deleted successfully." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Get all books sorted by createdAt in descending order
router.get("/get-all-books", async (req, res) => {
    try {
        const allBooks = await book.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order

        // Return success response with all books
        return res.status(200).json({ books: allBooks });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Get recent n books based on createdAt in descending order
router.get("/get-recent-books", async (req, res) => {
    try {
        // Get the limit from query parameters, default to 4 if not provided
        const lim = parseInt(req.query.limit) || 4;

        // Fetch the books from the database, sorted by createdAt in descending order, and limited by the specified count
        const recentBooks = await book.find().sort({ createdAt: -1 }).limit(lim);

        // Return success response with the recent books
        return res.status(200).json({ books: recentBooks });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});


// Get a book by its ID
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const bookId = req.params.id; // Get the book ID from request parameters

        // Find the book by its ID
        const bookDetails = await book.findById(bookId);

        // Check if the book exists
        if (!bookDetails) {
            return res.status(404).json({ message: "Book not found." });
        }

        // Return success response with book details
        return res.status(200).json({ books: bookDetails });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});



module.exports = router;
