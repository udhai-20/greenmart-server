

import mongoose from "mongoose";
import "dotenv/config"

// mongodb+srv://udhayaprakash:udhaya@cluster0.2hcazut.mongodb.net/test?retryWrites=true&w=majority

export const connectDb=async(uri)=>{
    console.log('uri:', uri);
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected successfully")
    } catch (error) {
        console.log('database connection error:', error);        
    }
}