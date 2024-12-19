import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

//asynchronus function define to connect database and return promise
const connectDB = async () => {
    const dbUrl = `${process.env.MONGODB_URL}/${DB_NAME}`;
    console.log("connecting to MongoDB at: ",dbUrl);

    try {
        const connectionInstance = await mongoose.connect(dbUrl, {
        // both for better connectivity 
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection failed !!!! ", error.message);
        process.exit(1);
    }
};
//export to use in another files
export default connectDB;