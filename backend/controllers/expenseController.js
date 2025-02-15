const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    const { category, amount, description } = req.body;
    const newExpense = new Expense({ userId: req.user.id, category, amount, description });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
