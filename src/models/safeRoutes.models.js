import mongoose, { Schema } from "mongoose";

const safeRouteSchema = new Schema(
    {
        startLocation: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
    }, {timestamps: true})

export const SafeRoute = mongoose.model("SafeRoute", safeRouteSchema)