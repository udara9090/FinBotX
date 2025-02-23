const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true }, // e.g., Food, Transport
  limit: { type: Number, required: true }, // Budgeted amount
  spent: { type: Number, default: 0 }, // Current spending in this category
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

module.exports = mongoose.model("Budget", budgetSchema);
