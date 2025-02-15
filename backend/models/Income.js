const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Refers to User model
  source: { type: String, required: true }, // Income source (e.g., "Salary", "Freelance")
  amount: { type: Number, required: true }, // Income amount
  date: { type: Date, default: Date.now }, // Income date (default is current date)
  description: { type: String }, // Optional description of the income
});

module.exports = mongoose.model("Income", IncomeSchema);
