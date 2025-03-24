const express = require("express");
const { getFinancialInsights, handleUserQuery } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Endpoint to get financial insights (AI-powered)

// Endpoint to handle user queries for conversational support
router.post("/query", protect, handleUserQuery);
router.get("/insights", protect, getFinancialInsights);

module.exports = router;
