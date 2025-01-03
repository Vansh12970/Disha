import mongoose, { isValidObjectId } from "mongoose";
import { SafeRoute } from "../models/SafeRoute.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Enter the current location
const getSafeRoute = asyncHandler(async(req, res) => {
     const{startLocation, destination} = req.body

     if(!startLocation && !destination) {
        throw new ApiError(500, "Required Start and End both locations")
     }

     const locationUpload = await SafeRoute.create([
        startLocation,
        destination,
     ])

     if(!locationUpload) {
        throw new ApiError(400, "Location fetch failed")
     }

     return res
     .status(200)
     .json(new ApiResponse(200, locationUpload, "Location data Fetched"))
})

export{
    getSafeRoute
}