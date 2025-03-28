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

// Update Expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount } = req.body;

    const expense = await Expense.findById(id);
    
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { category, amount },
      { new: true }
    );

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    await Expense.findByIdAndDelete(id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addExpense, getExpenses, updateExpense, deleteExpense };
