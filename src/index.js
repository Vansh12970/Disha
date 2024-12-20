import dotenv from "dotenv";
import connectDB from "./db/index.js";
import{app} from './app.js'


// Load environment variables
dotenv.config({
    path: './.env',
})

// Connect to the database define in db folder index.js
connectDB()
//listening return promise by connectDB()
.then(() => {
    app.listen(process.env.PORT || 8080, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch ((error) => {
     console.log("MONGODB connection failed!!!! ", error);
})




















