const router = require("express").Router();
const bcrypt = require("bcryptjs");
const user = require("../models/user");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { authenticationtoken } = require("./userauth");

// Sign-up functionality
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Validate username length
        if (username.length < 4) {
            return res.status(400).json({ message: "Username length should be greater than 3" });
        }

        // Check if username already exists
        const existingUsername = await user.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check if email already exists
        const existingEmail = await user.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Validate password length (must be greater than 5)
        if (password.length <= 5) {
            return res.status(400).json({ message: "Password length should be greater than 5" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new user({
            username,
            email,
            password: hashedPassword,  // Store hashed password
            address
        });

        // Save the new user to the database
        await newUser.save();

        // Return success response
        return res.status(201).json({ message: "Sign-up successful" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Sign-in functionality
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const existingUser = await user.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (isMatch) {
            const authClaims = {
                id: existingUser._id,
                name: existingUser.username,
                role: existingUser.role
            };
            const token = jwt.sign(authClaims, process.env.JWT_SECRET || "bookstore123", { expiresIn: "30d" });

            res.status(200).json({
                id: existingUser._id,
                role: existingUser.role,
                token: token
            });
        } else {
            return res.status(400).json({ message: "Invalid credentials" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get user information
//authenticatetoken -> when user reload or go to different page then every time using token validate the user and this will happen in every step
router.get("/get-user-information", authenticationtoken, async (req, res) => {
    try {
        // The authenticated user's ID is now available on req.user (decoded JWT token)
        const userId = req.user.id;
        const data = await user.findById(userId).select('-password');       //give all data (excluding password)
        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//update address
router.put("/update-address", authenticationtoken, async (req, res) => {
    try {
        const userId = req.user.id;  // Get user ID from the authenticated token
        const { address } = req.body;

        // Validate address (optional, depending on your requirements)
        if (!address || address.trim() === "") {
            return res.status(400).json({ message: "Address is required" });
        }

        // Update user's address
        await user.findByIdAndUpdate(userId, { address });
        return res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Change password functionality
router.put("/change-password", authenticationtoken, async (req, res) => {
    try {
        const userId = req.user.id;  // Get user ID from the authenticated token
        const { currentPassword, newPassword } = req.body;

        // Validate the new password length
        if (newPassword.length <= 5) {
            return res.status(400).json({ message: "New password length should be greater than 5" });
        }

        // Find the user by ID
        const existingUser = await user.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the current password with the stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        existingUser.password = hashedNewPassword;
        await existingUser.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Get user's purchased books
router.get("/purchased-books", authenticationtoken, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the authenticated token
        const userData = await user.findById(userId).populate('purchasedBooks');

        if (!userData) {
            return res.status(404).json({ message: "User not found." });
        }

        // Extract purchased books details
        const purchasedBooks = userData.purchasedBooks.map(book => ({
            id: book._id,
            title: book.title,
            author: book.author,
            pdfurl: book.pdfurl, // Include pdfurl for PDF access
            image: book.url
        }));

        return res.status(200).json({ books: purchasedBooks });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});




module.exports = router;
