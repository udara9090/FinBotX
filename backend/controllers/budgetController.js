const Budget = require("../models/Budget");

// Create Budget
const createBudget = async (req, res) => {
  const { category, limit, startDate, endDate } = req.body;
  const budget = await Budget.create({
    userId: req.user.id,
    category,
    limit,
    startDate,
    endDate,
  });
  res.status(201).json(budget);
};

// Get Budgets
const getBudgets = async (req, res) => {
  const budgets = await Budget.find({ userId: req.user.id });
  res.json(budgets);
};

// Update Budget Spending
const updateBudgetSpent = async (req, res) => {
  const { category, spent } = req.body;
  const budget = await Budget.findOneAndUpdate(
    { userId: req.user.id, category },
    { $inc: { spent } },
    { new: true }
  );
  res.json(budget);
};

module.exports = { createBudget, getBudgets, updateBudgetSpent };
