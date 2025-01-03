import { Router } from "express";
import { getSafeRoute } from "../controllers/safeRoutes.controllers";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/safe-route").post(verifyJWT, getSafeRoute)

export default router