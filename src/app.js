import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

//initilize express insatance in node.js projet and app varible use for middleware, routes, errorhandling
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential: true
}))
//limiting on json request (form)
app.use(express.json({limit: "20kb"}))
//url data encoder ({})
app.use(express.urlencoded({extended: true, limit: "20kb"}))
//to store images on server and publicly avaliable
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/report.routes.js"
import imageRouter from "./routes/reportImage.routes.js"
import aidRouter from "./routes/aid.routes.js"
import volunteerRouter from "./routes/volunteer.routes.js"
import routeRouter from "./routes/safeRoute.routes.js";

//Routes declaration
app.use("/api/v1/users", userRouter );
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/aid", aidRouter);
app.use("/api/v1/volunteer", volunteerRouter);
app.use("/api/v1/safeRoute", routeRouter);
//this will create a url like https:8080/api/v1/users/registers

export { app }
