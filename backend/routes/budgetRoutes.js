const express = require("express");
const {
  createBudget,
  getBudgets,
  updateBudgetSpent,
} = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBudget);
router.get("/", protect, getBudgets);
router.put("/update", protect, updateBudgetSpent);

module.exports = router;
