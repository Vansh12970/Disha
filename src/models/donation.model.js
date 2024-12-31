import mongoose, {Schema} from "mongoose"

const donationSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        upiId : {
            type: String,
            required: true,
        },
    },{timestamps: true})

export const Donation = mongoose.model("Donation", donationSchema)