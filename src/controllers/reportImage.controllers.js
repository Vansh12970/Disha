import mongoose from "mongoose";
import { reportImage } from "../models/reportImage.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { 
    deleteResourceOnCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary";

// upload the report - image
const sendImageReport = asyncHandler(async(req, res) => {
    const {title, description} = req.body;

    if(!(title.trim() && description.trim())) {
        throw new ApiError(400, "Report title and description is required");
    }
    
    const imageLocalPath = req.files?.imageFile[0]?.path;
    if(!imageLocalPath) {
        throw new ApiError(400, "Image file is required");
    }

    const image = await uploadOnCloudinary(imageLocalPath)

    if(!image) {
        throw new ApiError(400, "Image Uploading failed")
    }

    const imageUpload = await reportImage.create({
        imageFile: image.url,
        title,
        description,
        owner: req.user?._id,
    });

    if(!imageUpload) {
        throw new ApiError(500, "Failed to upload the image");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, imageUpload, "Image uploaded Successfully"))
});

// Update the report controller
const updateImage = asyncHandler(async(req, res) => {
    const{ imageId } = req.params;
    const {title, description} = req.body;

    const image = await reportImage.findById(imageId);
    if(!image) {
        throw new ApiError(404, "Report-Image is not found")
    }

    // check the owner of image is user 
    if(image.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized: You are not authorized to make changes")
    };
    
    const imageLocalPath = req.file?.path;
    const newImage = await uploadOnCloudinary(imageLocalPath);

    if(!newImage) {
        throw new ApiError(500, "Image upload on cloudinary failed")
    }

    //Update image details in database
    const imageUpdate = await reportImage.findByIdAndUpdate(imageId,
        {
            $set: {
                title: title,
                description: description,
                imageFile: newImage.url,
            }
        },
        {
            new : true
        }
    );

    if(!imageUpdate) {
        throw new ApiError(500, "Failed to update details")
    }

    await deleteResourceOnCloudinary(image.imageFile)

    return res
    .status(200)
    .json(new ApiResponse(200, imageUpdate, "Details Updated Successfully"))
})

//Delete the image controller
const deleteImage = asyncHandler(async (req, res) => {
    const { imageId } = req.params;

    if(!mongoose.isValidObjectId(imageId)) {
        throw new ApiError(400, "Invalid image ID")
    }

    const image = await reportImage.findById(imageId);
    if (!image) {
        throw new ApiError(404, "Image is not found");
    }

    //check user is owner of video
    if(image.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized: You are not able to make changes")
    };

    const deleteImage = await Report.findByIdAndDelete(image._id);

    if(!deleteImage) {
        throw new ApiError(500, "Failed to delete the Image");
    }

    await deleteResourceOnCloudinary(deleteImage?.imageFile);

    return res
    .status(200)
    .json(new ApiResponse(200, "Image deleted successfully"))
})

// Toggle publish status of image controller
const togglePublishStatus = asyncHandler (async(req, res) => {
    const { imageId } =req.params;

    const image = await reportImage.findById(imageId);

    if(!image) {
        throw new ApiError(500, "Image not found");
    }
    //check user is authorized
    if(image.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized: you are not authorized to change publish status")
    }

    image.isPublished = !image.isPublished;
    const updateImage = await image.save({validateBeforeSave: false});

    if(!updateImage) {
        throw new ApiError(500, "Failed to toggle publish status of image");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updateImage, "Image Publish Status Updated Successfully"));

})

export {
    sendImageReport,
    updateImage,
    deleteImage,
    togglePublishStatus,
}

