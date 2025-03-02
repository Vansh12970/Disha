const mongoose = require('mongoose');
require('dotenv').config();

// Connection to MongoDB- please correct all this, where to put what, ig this would be put in model directory
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Defining the schema for tweets
const tweetSchema = new mongoose.Schema({
    tweet: String,
    classification: String,
    location: String,
});

// Creating the model
const Tweet = mongoose.model('Tweet', tweetSchema);

// Saving a tweet to the database
const saveTweet = async (tweet, classification, location = null) => {
    const newTweet = new Tweet({ tweet, classification, location });
    await newTweet.save();
};

module.exports = { saveTweet };