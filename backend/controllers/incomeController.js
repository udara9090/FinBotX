const Income = require("../models/Income");

exports.addIncome = async (req, res) => {
  try {
    const { source, amount, description } = req.body;
    const newIncome = new Income({ userId: req.user.id, source, amount, description });
    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getIncome = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(income);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
