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
app.use(cookieParser)

export { app }
