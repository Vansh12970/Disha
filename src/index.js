//require('dotenv').config({path: './env'});
//new method of uper line and changes in package.json script
import dotenv from "dotenv";
import connectDB from "./db/index.js";

// Load environment variables
dotenv.config({
    path: './env',
});

// Connect to the database define in db folder index.js
connectDB()
//listening return promise by connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("ERROR APP NOT ABLE TO TALK TO DATABASE : ", error);
        throw error
  })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch ((error) => {
     console.log("MONGODB connection failed!!!! ", err);
})



















