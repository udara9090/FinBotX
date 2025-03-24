

const express = require("express");
const { createSharedBudget, updateSharedBudget,getSharedBudgets } = require("../controllers/sharedBudgetController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createSharedBudget);

router.get("/", protect, getSharedBudgets);

router.put("/update", protect, updateSharedBudget);

module.exports = router;
