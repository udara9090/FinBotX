const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Refers to User model
  category: { type: String, required: true }, // Budget category (e.g., "Food", "Transport")
  amount: { type: Number, required: true }, // Budgeted amount
  startDate: { type: Date, default: Date.now }, // Budget start date
  endDate: { type: Date }, // Budget end date (optional)
});

module.exports = mongoose.model("Budget", BudgetSchema);
