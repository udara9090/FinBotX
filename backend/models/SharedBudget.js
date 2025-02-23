const mongoose = require("mongoose");

const sharedBudgetSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Roommates Budget"
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of participants
  totalBudget: { type: Number, required: true },
  spent: { type: Number, default: 0 },
});

module.exports = mongoose.model("SharedBudget", sharedBudgetSchema);
