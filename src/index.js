import dotenv from "dotenv";
import connectDB from "./db/index.js";

//load enviornment variables
dotenv.config({
    path: './env'
});

//connect to database define in db folder in index.js
connectDB()
//listening return promise by connectDB() GENERATE
.then(() => {
    app.on("error", (error) => {
        console.log("ERROR APP NOT ABLE TO TALK TO DATABASE: ", error);
        throw error
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);

    })
})
.catch ((error) => {
    console.log("MONGODB connection failed !! ", error);
})