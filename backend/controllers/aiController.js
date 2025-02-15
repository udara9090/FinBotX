const { analyzeExpenses } = require("../services/aiService");

exports.getAIExpenseAnalysis = async (req, res) => {
  try {
    const expenses = req.body.expenses;  // Get expenses from the request body

    // Check if expenses are provided
    if (!expenses || expenses.length === 0) {
      return res.status(400).json({ message: "No expenses data provided" });
    }

    // Call the analyzeExpenses function from the service to get AI-powered analysis
    const analysis = await analyzeExpenses(expenses);

    // Send the analysis result as the response
    res.json({ message: analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
