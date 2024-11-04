const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fuxwing.com%2Fman-person-icon%2F&psig=AOvVaw3TCFEqtsuU4oU6xrpjLljv&ust=1729890855550000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJj-_-D3p4kDFQAAAAAdAAAAABAE"
    },
    role:{
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    favourites: [
        {
            type: mongoose.Types.ObjectId,
            ref: "book",
        }
    ],
    cart: [
        {
            type: mongoose.Types.ObjectId,
            ref: "book",
        }
    ],
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref: "order",
        }
    ],
    purchasedBooks: [
        {
            type: mongoose.Types.ObjectId,
            ref: "book",
        }
    ]

}, {timestamps: true});

module.exports = mongoose.model("user", user);