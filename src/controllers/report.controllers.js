import mongoose from "mongoose";
import { Report } from "../models/report.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    deleteResourceOnCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";

// upload the report
const sendVideoReport = asyncHandler(async (req, res) => {
    const {title, description} = req.body;

    if(!(title.trim() && description.trim())) {
        throw new ApiError(400, "Report title and description is required!");
    }

    const videoLocalPath = req.files?.videoFile[0]?.path;
    if(!videoLocalPath) {
        throw new ApiError(400, "Video File is Required");
    }

    const video = await uploadOnCloudinary(videoLocalPath);

    if(!video) {
        throw new ApiError(400, "Video uploading failed");
    }

    const videoUpload = await Report.create({
        videoFile: video.url,
        title,
        description,
        owner: req.user?._id,
    });

    if(!videoUpload) {
        throw new ApiError(500, "Failed to upload the video");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, videoUpload, "Video Uploaded Successfully"));
});

// update the report controller
const updateVideo = asyncHandler(async(req, res) => {
    const { videoId } = req.params;
    const {title, description} = req.body;

    const video = await Report.findById(videoId);
    if(!video) {
        throw new ApiError(404, "video is not found")
    }

    // check the owner of video is user
    if(video.owner.toString() !== req.user?._id.toString()) { 
        throw new ApiError(400, "Unauthorized: You are not authorized to make changes")
    };

    //Update video details in database 
    const videoUpdate = await Report.findByIdAndUpdate(videoId,
        {
            $set: {
                title: title,
                description: description,
            }
        },
        {
            new : true
        }
    );

    if(!videoUpdate) {
        throw new ApiError(500, "Failed to update the details");
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, videoUpdate, "Details Updated Successfully"))
})

//Delete the video controller
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if(!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Report.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video is not found");
    }

    //check user is owner of video
    if(video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized: You are not able to make changes")
    };

    const deleteVideo = await Report.findByIdAndDelete(video._id);

    if(!deleteVideo) {
        throw new ApiError(500, "Failed to delete the Video");
    }

    await deleteResourceOnCloudinary(deleteVideo?.videoFile);

    return res
    .status(200)
    .json(new ApiResponse(200, "Video deleted successfully"))
})

// Toggle publish status of video controller
const togglePublishStatus = asyncHandler (async(req, res) => {
    const { videoId } =req.params;

    const video = await Report.findById(videoId);

    if(!video) {
        throw new ApiError(500, "Video not found");
    }
    //check user is authorized
    if(video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized: you are not authorized to change publish status")
    }

    video.isPublished = !video.isPublished;
    const updateVideo = await video.save({validateBeforeSave: false});

    if(!updateVideo) {
        throw new ApiError(500, "Failed to toggle publish status of video");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updateVideo, "Video Publish Status Updated Successfully"));

})

export {
    sendVideoReport,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
}

