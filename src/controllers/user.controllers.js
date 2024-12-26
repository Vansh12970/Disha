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
            (field) => field?.trim() === ""
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
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage)
    && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path}
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // Store in database
    const user = await User.create({
        fullName,
        email,
        password, 
        username: username.toLowerCase(),
        coverImage: coverImage?.url || "",
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

//console.log("Exporting registerUser:", typeof registerUser);
