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
        owner : {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },{timestamps: true})

export const Donation = mongoose.model("Donation", donationSchema)