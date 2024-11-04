const mongoose = require("mongoose");

//not taken order as array as one order will represented by one user only 
//same order can't reflect to different users
const order = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    book:{
        type: mongoose.Types.ObjectId,
        ref: "book", 
    },
    status:{
        type: String,
        default: "Order Placed",
        enum: ["Order Placed", "Out for Delivery", "Delivered", "Canceled"],
    }
},{timestamps: true});

module.exports = mongoose.model("order", order);