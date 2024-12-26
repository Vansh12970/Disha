import mongoose, { Schema } from "mongoose" ;
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase:true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        addressLine1: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String, //cloudinary url
        },
        location :{
            type: {
                lat: {type: Number, required: true,},
                lng: {type: Number, required: true}
            },
        },
        // should i include this feature that how many videos user watch, the videos comes in report
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Report",
            }
        ],
        password: {
            type: String,
            required :[true, "Password is required"]
        }
    },{timestamps:true})

//Before saving data encrypt the password using (bcrypt) middleware
userSchema.pre("save", async function (next) {

//if password doesn't change then no need to encrypt again direct move to next()
    if(!this.isModified("password")) return next();
    
//if password change encrypt again
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password) 
}

//generate_access_token and generate_refresh_token to create jwt for user authentication
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
//this method access token contain these information
            _id:this.id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
//this method access token contain this information
        {
            _id:this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)