import mongoose from "mongoose";

const connection = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongodb connected");
    } catch (error) {
        console.log("connection failed", error);
    }
}

export default connection;