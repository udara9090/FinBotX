const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  source: { type: String, required: true }, // e.g., Salary, Freelance, Investments
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Income", incomeSchema);
