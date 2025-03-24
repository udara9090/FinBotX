const axios = require("axios");
const Expense = require("../models/Expense");
const Income = require("../models/Income");

const getFinancialInsights = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    const income = await Income.find({ userId: req.user.id });

    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const prompt = 
      `Based on the user's total income ($${totalIncome}) and total expenses ($${totalExpenses}), 
      provide financial insights including:
      1. Smart saving tips.
      2. Alternative expense suggestions.
      3. Investment recommendations.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const fullText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Basic parsing of the AI response
    const parseSection = (title, text) => {
      const regex = new RegExp(`${title}[:\\-\\n]*([^#\\n]+)`, "i");
      const match = text.match(regex);
      return match ? match[1].trim() : "No insights available";
    };

    const smartSavingTips = parseSection("1. Smart saving tips", fullText);
    const alternativeExpenses = parseSection("2. Alternative expense suggestions", fullText);
    const investmentRecommendations = parseSection("3. Investment recommendations", fullText);

    res.json({
      smartSavingTips,
      alternativeExpenses,
      investmentRecommendations,
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to generate financial insights." });
  }
};

// Handle user queries for conversational support
const handleUserQuery = async (req, res) => {
  try {
    const { query } = req.body;  // User query (e.g., "How much did I spend on dining?")
    const category = query.match(/spent on (.*)\?/i);  // Extract category from query

    if (!category || category.length < 2) {
      return res.status(400).json({ error: "Invalid query format. Example: How much did I spend on <category>?" });
    }

    const categoryName = category[1].trim().toLowerCase();  // Clean up the category name
    const expenses = await Expense.aggregate([
      { $match: { userId: req.user.id, category: { $regex: categoryName, $options: "i" } } },
      { $group: { _id: null, totalSpent: { $sum: "$amount" } } }
    ]);

    if (expenses.length === 0 || !expenses[0].totalSpent) {
      return res.json({ message: `You haven't spent anything on ${categoryName}.` });
    }

    res.json({ totalSpent: expenses[0].totalSpent });
  } catch (error) {
    console.error("Query Error:", error);
    res.status(500).json({ error: "Failed to process user query." });
  }
};


module.exports = { getFinancialInsights, handleUserQuery };
