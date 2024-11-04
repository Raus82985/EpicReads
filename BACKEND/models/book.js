const mongoose = require("mongoose");

const book = new mongoose.Schema({
    url:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    Price:{
        type: Number,
        required: true,
    },
    Descreption:{
        type: String,
        required: true,
    },
    language:{
        type: String,
        required: true,
    },
    pdfurl:{
        type: String,
    }
    
},{timestamps: true});

module.exports = mongoose.model("book", book);