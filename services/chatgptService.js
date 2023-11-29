import OpenAI from 'openai';

export const getChatGPTRecommendation = async (data) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env["OPENAI_API_KEY"]
        });

        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: `Convert this HTML to Contentful document. Start with tag document:
´´´
${data}
´´´
                    `
                }],
            temperature: 0
        });
        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        throw new Error(error.message);
    }
}