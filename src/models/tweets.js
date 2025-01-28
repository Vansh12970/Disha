import monggose, { Schema } from "mongoose";

const tweetSchema = new Schema(
    {
        tweet: {
            type: String,
            required: true
        },
        owner: {
            type: String,
        }
    },{timestamps: true})

export const Tweet = mongoose.model("Tweet", tweetSchema)