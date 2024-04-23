require("dotenv").config();
const mongoose = require("mongoose")

try {
    mongoose.connect(process.env.DB_NAME); 
    console.log("Connected Successfully");
} catch (error) {
    console.log("Error while connecting with database");
}



