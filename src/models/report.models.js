import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const reportSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true,
        },
// should i add this
        thumbnail: {
            type: String, //cloudinary url
            required: true,
        },
        image: {
            type: String,  //cloudinary url
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
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