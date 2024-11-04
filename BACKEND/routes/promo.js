const router = require("express").Router();
const PromoCode = require("../models/promo"); // Adjust the path as necessary
const { authenticationtoken } = require("./userauth");

// Helper function to check if user is an admin
const isAdmin = (currentUser) => currentUser && currentUser.role === "admin";

// Add a new promo code
router.post("/add-promo", authenticationtoken, async (req, res) => {
    try {
        const currentUser = req.user; // Access the current user from req.user
        console.log(currentUser.role);
        
        if (!isAdmin(currentUser)) {
            return res.status(403).json({ message: "Access denied: You do not have permission to perform this action." });
        }



        const { code, discountType, discountValue, startDate, endDate, usageLimit, applicableProducts, userRestrictions } = req.body;

        // Validate required fields
        if (!code || !discountType || discountValue === undefined || !startDate || !endDate) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check for duplicate promo code
        const existingPromoCode = await PromoCode.findOne({ code });
        if (existingPromoCode) {
            return res.status(400).json({ message: "This promo code already exists." });
        }

        // Create a new promo code instance
        const newPromoCode = new PromoCode({
            code,
            discountType,
            discountValue,
            startDate,
            endDate,
            usageLimit,
            applicableProducts,
            userRestrictions,
        });

        // Save the new promo code to the database
        await newPromoCode.save();

        // Return success response
        return res.status(201).json({ message: "Promo code added successfully", promoCode: newPromoCode });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Delete an existing promo code
router.delete("/delete-promo/:id", authenticationtoken, async (req, res) => {
    try {
        const currentUser = req.user; // Access the current user from req.user
        const promoId = req.params.id; // Get promo code ID from request parameters

        // Check if the user is an admin
        if (!isAdmin(currentUser)) {
            return res.status(403).json({ message: "You are not authorized to perform this action." });
        }

        // Find the existing promo code
        const existingPromoCode = await PromoCode.findById(promoId);
        if (!existingPromoCode) {
            return res.status(404).json({ message: "Promo code not found." });
        }

        // Delete the promo code
        await PromoCode.findByIdAndDelete(promoId);

        // Return success response
        return res.status(200).json({ message: "Promo code deleted successfully." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Validate a promo code
router.post("/validate-promo", async (req, res) => {
    try {
        const { code, userId } = req.body; // Include userId if you want to check restrictions

        // Validate required fields
        if (!code) {
            return res.status(400).json({ message: "Promo code is required." });
        }

        // Check if the promo code exists
        const existingPromoCode = await PromoCode.findOne({ code });
        if (!existingPromoCode) {
            return res.status(404).json({ message: "Invalid promo code." });
        }

        // Debug logs
        const currentDate = new Date();
        // Check if the promo code is active based on dates
        if (currentDate < new Date(existingPromoCode.startDate) || currentDate > new Date(existingPromoCode.endDate)) {
            return res.status(400).json({ message: "Promo code is expired." });
        }

        // Check usage limit and user restrictions
        if (existingPromoCode.usageLimit <= 0) {
            return res.status(400).json({ message: "Promo code usage limit exceeded." });
        }
        if (existingPromoCode.userRestrictions && existingPromoCode.userRestrictions.includes(userId)) {
            return res.status(403).json({ message: "You are not allowed to use this promo code." });
        }

        // Return success response with discount details
        return res.status(200).json({
            message: "Promo code is valid.",
            discountType: existingPromoCode.discountType,
            discountValue: existingPromoCode.discountValue,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Get all promo codes
router.get("/promos", async (req, res) => {
    try {
        // Fetch all promo codes from the database
        const promoCodes = await PromoCode.find();

        // Return success response with the list of promo codes
        return res.status(200).json(promoCodes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});



module.exports = router;
