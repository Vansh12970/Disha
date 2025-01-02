import { Router } from 'express';
import {
    sendImageReport,
    updateImage,
    deleteImage,
    togglePublishStatus,
} from "../controllers/reportImage.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .post(
        upload.fields([
            {
                name: "imageFile",
                maxCount: 1,
            }, 
        ]),
        sendImageReport
    );

router
    .route("/:imageId")
    .delete(deleteVideo)
    .patch(upload.single("imageFile"), imageUpdate);

router.route("/toggle/publish/:imageId").patch(togglePublishStatus);

export default router