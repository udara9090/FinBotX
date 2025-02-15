const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeExpenses = async (expenses) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Analyze these expenses and suggest savings: ${JSON.stringify(expenses)}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
};
