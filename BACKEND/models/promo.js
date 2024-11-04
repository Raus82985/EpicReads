// models/PromoCode.js
const mongoose = require('mongoose');

const promo = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number,
        default: 1,
    },
    applicableProducts: {
        type: [String], // Array of product IDs or names
        default: [],
    },
    userRestrictions: {
        type: [String], // Array of user IDs or roles
        default: [],
    },
});

module.exports  = mongoose.model('promo', promo);

