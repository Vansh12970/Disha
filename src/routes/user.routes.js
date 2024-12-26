import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

//console.log("registerUser: ", registerUser)
//console.log("upload: ", upload)

router.route("/register").post(
    
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser)
    



export default router