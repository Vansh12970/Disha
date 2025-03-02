const scrapeTweets = require('./scraper');
const analyzeTweet = require('./openai');
const { saveTweet } = require('./database');
require('dotenv').config();

const main = async () => {
    const tweets = await scrapeTweets();

    for (const tweet of tweets) {
        const { classification, location } = await analyzeTweet(tweet);

        if (classification === 'disaster') {
            // Save to MongoDB
            await saveTweet(tweet, classification, location);
            console.log(`Saved tweet: ${tweet}`);
        }
    }
};

main();