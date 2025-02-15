const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Refers to User model
  reportType: { type: String, required: true }, // Report type (e.g., "Monthly Summary", "Expense Breakdown")
  data: { type: Object, required: true }, // Report data (can be a JSON object containing the details)
  date: { type: Date, default: Date.now }, // Date when the report was generated
});

module.exports = mongoose.model("Report", ReportSchema);
