const mongoose = require("mongoose");

//built connection with the database
const connection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("Connected to Database");
        
    } catch (error) {
        console.log("CONNECTION || MONGOOSE", error);
    }
}

connection();