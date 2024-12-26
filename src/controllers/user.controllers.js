import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const registerUser = asyncHandler(async (req, res) => {
   
    const {fullName, email, username, password, addressLine1, state, city, location } = req.body

    if(
        [fullName, email, username, password, addressLine1, state, city, location ].some((field) => 
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new ApiError(409, "User with this email or username already exist")
    }

    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar)
    && req.files.avatar.length > 0) {
    avatarLocalPath = req.files.avatar[0].path}

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar) {
        throw new ApiError(400, "Avatar file required")
    }

    //store in database
    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        avatar : avatar?.url || "",
        city,
        state,
        addressLine1,
        location,
    })
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Something Went Wrong")
    }
//  When user successfully created

    return res.status(201).json(
      new ApiResponse(200, createdUser, "User Registerd Successfully")
   )
})


export { registerUser }