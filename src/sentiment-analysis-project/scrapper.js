const axios = require('axios');
const cheerio = require('cheerio');

const disasterKeywords = [
    // Natural Disasters
    'earthquake', 'flood', 'tsunami', 'hurricane', 'cyclone', 'tornado', 'typhoon',
    'volcano', 'eruption', 'landslide', 'avalanche', 'wildfire', 'bushfire', 'drought',
    'heatwave', 'blizzard', 'snowstorm', 'hailstorm', 'thunderstorm', 'lightning',
    'storm surge', 'famine', 'epidemic', 'pandemic', 'disease outbreak',

    // Man-Made Disasters- If you want you can delete this part
    'terrorism', 'bombing', 'explosion', 'shooting', 'mass shooting', 'riot', 'civil unrest',
    'war', 'nuclear explosion', 'chemical spill', 'oil spill', 'radiation leak',
    'factory explosion', 'mine collapse', 'building collapse', 'bridge collapse',
    'train derailment', 'plane crash', 'shipwreck', 'car accident', 'industrial accident',
    'cyber attack', 'hacking', 'data breach', 'arson', 'sabotage', 'hostage situation',
    'mass casualty', 'toxic leak', 'pollution', 'environmental disaster'
];

const scrapeTweets = async () => {
    try {
        const query = disasterKeywords.join(' OR ');
        const url = `https://twitter.com/search?q=${encodeURIComponent(query)}&src=typed_query`;
        const response = await axios.get(url);

        const $ = cheerio.load(response.data);
        const tweets = [];

        $('div[data-testid="tweet"]').each((i, element) => {
            const tweetText = $(element).find('div[lang]').text().trim();
            tweets.push(tweetText);
        });

        return tweets;
    } catch (error) {
        console.error('Error scraping tweets:', error);
        return [];
    }
};

module.exports = scrapeTweets;