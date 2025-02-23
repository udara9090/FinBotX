const Income = require("../models/Income");

// Add Income
const addIncome = async (req, res) => {
  const { source, amount } = req.body;
  const income = await Income.create({ userId: req.user.id, source, amount });
  res.status(201).json(income);
};

// Get Income
const getIncome = async (req, res) => {
  const income = await Income.find({ userId: req.user.id });
  res.json(income);
};

module.exports = { addIncome, getIncome };
