import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password, addressLine1, state, city, location } = req.body;

    // Validate required fields
    if (
        [fullName, email, username, password, addressLine1, state, city, location].some(
            (field) => field === undefined || field === null || (typeof field === "string" && field.trim() === "")
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

   
    // Handle coverImage upload
    let profileImageLocalPath;
    if (req.files && Array.isArray(req.files.profileImage)
    && req.files.profileImage.length > 0) {
        profileImageLocalPath = req.files.profileImage[0].path}
    
    
    const profileImage = await uploadOnCloudinary(profileImageLocalPath)

    // Store in database
    const user = await User.create({
        fullName,
        email,
        password, 
        username: username.toLowerCase(),
        profileImage: profileImage?.url || "",
        city,
        state,
        addressLine1,
        location,
    });

    // Fetch the created user excluding sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong");
    }

    // When user successfully created
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

export { registerUser };
//export with variable import with variable
//console.log("Exporting registerUser:", typeof registerUser);
