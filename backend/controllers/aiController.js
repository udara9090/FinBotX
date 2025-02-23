const axios = require("axios");
const Expense = require("../models/Expense");
const Income = require("../models/Income");

const getFinancialInsights = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    const income = await Income.find({ userId: req.user.id });

    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const prompt = `
      Based on the user's total income ($${totalIncome}) and total expenses ($${totalExpenses}), 
      provide financial insights including:
      1. Smart saving tips.
      2. Alternative expense suggestions.
      3. Investment recommendations.
    `;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText",
      {
        prompt,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to generate financial insights." });
  }
};

module.exports = { getFinancialInsights };
