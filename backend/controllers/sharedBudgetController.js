const SharedBudget = require("../models/SharedBudget");

// Create a Shared Budget
const createSharedBudget = async (req, res) => {
  try {
    const { name, totalBudget, users } = req.body;
    const sharedBudget = await SharedBudget.create({ name, totalBudget, users });
    res.status(201).json(sharedBudget);
  } catch (error) {
    res.status(500).json({ error: "Error creating shared budget" });
  }
};

// Get Shared Budgets for a User
const getSharedBudgets = async (req, res) => {
  try {
    const budgets = await SharedBudget.find({ users: req.user.id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching shared budgets" });
  }
};

// Add the missing updateSharedBudget function
const updateSharedBudget = async (req, res) => {
  try {
    const { budgetId, spentAmount } = req.body;
    const budget = await SharedBudget.findByIdAndUpdate(
      budgetId,
      { $inc: { spent: spentAmount } },
      { new: true }
    );

    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: "Error updating shared budget" });
  }
};

module.exports = { createSharedBudget, getSharedBudgets, updateSharedBudget };
