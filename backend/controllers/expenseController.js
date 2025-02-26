const Expense = require("../models/Expense");

// Add a new expense
const addExpense = async (req, res) => {
  try {
    const { amount, category } = req.body;
    const expense = await Expense.create({ userId: req.user.id, amount, category });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: "Error adding expense" });
  }
};

// Get all expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching expenses" });
  }
};

module.exports = { addExpense, getExpenses };
