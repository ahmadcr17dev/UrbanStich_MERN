const mongoose = require("mongoose");
require("dotenv").config();

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected");
    } catch (error) {
        console.log("Error in connection: ", error);
        process.exit(1);
    }
}

module.exports = connectdb;