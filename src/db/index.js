import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//asynchronus function define to connect database and return promise
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection failed !!!! ", error.message);
        process.exit(1);
    }
};
//export to use in another files
export default connectDB;