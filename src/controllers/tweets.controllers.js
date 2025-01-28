import mongoose, {isValidObjectId} from "mongoose"
import {Tweet} from "../models/tweets.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { application } from "express"

const createTweet = asyncHandler(async(req, res) => {
    const { content } = req.body;

    const createTweet = await Tweet.create({
        content: content,
        owner: req.user?._id,
    });

    if(!createTweet) {
        throw new ApiError(500, "Failed to create the tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createTweet, "Tweet is created Successfully"));

});

const getUserTweets = asyncHandler(async(req, res) => {
 const { userId } = rq.params;

 const findTweets = await Tweet.aggregate([
    {
        $match: {
            owner: new mongoose.Types.ObjectId(userId),
        },
    },
    {
        $lookup: {
            from : "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
                {
                    $project:{
                        username: 1,
                        avatar:1,
                        fullName: 1,
                    },
                },
            ], 
        },
    },
    {
        $addFields: {
            ownerDetails: {
                $first: "$owner",
            },
        },
    },
    {
        $project: {
            owner: 0,
        },
    },
 ]);

 if (!findTweets.length) {
    throw new ApiError(404, "No tweets found");
 }

 return res 
    .status(200)
    .json(new ApiResponse(200, findTweets, "User tweet fetched successfully"));
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet is not found");
  }

  if (tweet.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      403,
      "Unauthorized: you are not authorized to delete this tweet"
    );
  }

  await Tweet.findByIdAndDelete(tweet._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet is deleted Successfully"));

});

export {
    createTweet,
    getUserTweets,
    deleteTweet,
};