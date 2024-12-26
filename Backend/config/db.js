import mongoose from "mongoose";
// import seedDatabase from "./db1.js";


const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://user:user123@cluster0.fn9be.mongodb.net/MERN_CRUD");
        console.log("connected to mongodb database");
        // seedDatabase();
    } catch (error) {
        console.log(`Error in mongodb ${error}`);
    }
}

export default connectDB;
