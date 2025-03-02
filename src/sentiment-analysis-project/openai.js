const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const analyzeTweet = async (tweet) => {
    try {
        const prompt = `Classify the following tweet as "disaster" or "non-disaster". If it's a disaster, extract the location if mentioned:\n\nTweet: "${tweet}"\n\nClassification:`;
        const response = await openai.createCompletion({
            model: 'text-davinci-003', // Use GPT-3.5 or GPT-4
            prompt: prompt,
            max_tokens: 50,
        });

        const result = response.data.choices[0].text.trim();
        const classification = result.includes('disaster') ? 'disaster' : 'non-disaster';

        // Extract location (basic example)
        const locationMatch = result.match(/Location:\s*(\w+)/i);
        const location = locationMatch ? locationMatch[1] : null;

        return { classification, location };
    } catch (error) {
        console.error('Error analyzing tweet with OpenAI:', error);
        return { classification: 'error', location: null };
    }
};

module.exports = analyzeTweet;