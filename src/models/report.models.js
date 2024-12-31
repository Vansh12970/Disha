import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const reportSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true,
        },
        imageFile: {
            type: String,  //cloudinary url
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    },{timestamps:true})

reportSchema.plugin(mongooseAggregatePaginate)

export const Report = mongoose.model("Report", reportSchema)