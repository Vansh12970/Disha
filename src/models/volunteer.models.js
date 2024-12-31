import mongoose, {Schema} from "mongoose"

const volunteerSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        contactDetails: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
    },{timestamps: true})


export const Volunteer = mongoose.model("Volunteer", volunteerSchema)